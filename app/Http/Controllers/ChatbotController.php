<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OpenAIService;
use App\Models\ChatMessage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    private $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Get or create a chat session ID
     */
    private function getChatSessionId()
    {
        // Use user ID for authenticated users, session ID for guests
        if (Auth::check()) {
            return 'user_' . Auth::id();
        }
        
        $sessionId = session()->get('chat_session_id');
        
        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
            session()->put('chat_session_id', $sessionId);
        }
        
        return 'session_' . $sessionId;
    }

    /**
     * Get chat query based on authentication status
     */
    private function getChatQuery()
    {
        // Query messages by user_id for authenticated users, session_id for guests
        if (Auth::check()) {
            return ChatMessage::where('user_id', Auth::id());
        }
        return ChatMessage::where('session_id', $this->getChatSessionId());
    }

    /**
     * Get chat messages from database
     */
    public function getMessages(Request $request)
    {
        $messages = $this->getChatQuery()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'role' => $message->role,
                    'content' => $message->content
                ];
            });

        return response()->json([
            'messages' => $messages
        ]);
    }

    public function message(Request $request)
    {
        $validated = $request->validate(['message' => 'required|string|max:2000']);
        
                // Get session ID and save user message to database
        $sessionId = $this->getChatSessionId();
        
        $messageData = [
            'session_id' => $sessionId,
            'role' => 'user',
            'content' => $validated['message']
        ];
        
        // Add user_id for authenticated users
        if (Auth::check()) {
            $messageData['user_id'] = Auth::id();
        }
        
        ChatMessage::create($messageData);
        
        // Get or create thread ID for this session
        $threadId = session()->get('chat_thread_id');
        
        if (!$threadId) {
            $threadId = $this->openAIService->createThread();
            if (!$threadId) {
                echo "data: " . json_encode([
                    'type' => 'error',
                    'content' => 'Unable to start conversation. Please try again.'
                ]) . "\n\n";
                return;
            }
            session()->put('chat_thread_id', $threadId);
        }

        // Send message to OpenAI Assistant
        $assistantReply = $this->openAIService->sendMessage($threadId, $validated['message']);
        
        if (!$assistantReply) {
            return response()->json([
                'error' => 'Sorry, I am having trouble processing your message. Please try again.',
            ], 500);
        }

        // Save assistant response to database
        $assistantMessageData = [
            'session_id' => $sessionId,
            'role' => 'assistant',
            'content' => $assistantReply
        ];
        
        // Add user_id for authenticated users
        if (Auth::check()) {
            $assistantMessageData['user_id'] = Auth::id();
        }
        
        ChatMessage::create($assistantMessageData);

        // Get conversation history to return to frontend
        $history = $this->openAIService->getConversationHistory($threadId);
        
        // Format history for frontend (keep existing session format for compatibility)
        $formattedHistory = [];
        foreach ($history as $message) {
            $formattedHistory[] = [
                'role' => $message['role'],
                'content' => $message['content'],
            ];
        }

        return response()->json([
            'messages' => $formattedHistory,
            'risk' => null, // Keep this for frontend compatibility
        ]);
    }

    /**
     * Stream message response from OpenAI Assistant
     */
    public function messageStream(Request $request)
    {
        $validated = $request->validate(['message' => 'required|string|max:2000']);
        
        // Get session ID and save user message to database
        $sessionId = $this->getChatSessionId();
        
        $userMessageData = [
            'session_id' => $sessionId,
            'role' => 'user',
            'content' => $validated['message']
        ];
        
        // Add user_id for authenticated users
        if (Auth::check()) {
            $userMessageData['user_id'] = Auth::id();
        }
        
        ChatMessage::create($userMessageData);
        
        // Get or create thread ID for this session
        $threadId = session()->get('chat_thread_id');
        
        if (!$threadId) {
            $threadId = $this->openAIService->createThread();
            if (!$threadId) {
                return response()->json(['error' => 'Unable to start conversation. Please try again.'], 500);
            }
            session()->put('chat_thread_id', $threadId);
        }

        return response()->stream(function () use ($threadId, $validated, $sessionId) {
            // Set up Server-Sent Events headers
            echo "data: " . json_encode(['type' => 'start']) . "\n\n";
            ob_flush();
            flush();

            try {
                $fullResponse = '';
                
                foreach ($this->openAIService->sendMessageStream($threadId, $validated['message']) as $chunk) {
                    // Check if chunk is an error
                    if (strpos($chunk, '{"error"') === 0) {
                        echo "data: " . json_encode([
                            'type' => 'error',
                            'content' => json_decode($chunk, true)['error']
                        ]) . "\n\n";
                        ob_flush();
                        flush();
                        return;
                    }
                    
                    $fullResponse .= $chunk;
                    
                    echo "data: " . json_encode([
                        'type' => 'chunk',
                        'content' => $chunk
                    ]) . "\n\n";
                    
                    ob_flush();
                    flush();
                    
                    // Small delay to prevent overwhelming the client
                    usleep(50000); // 50ms delay
                }

                // Save assistant response to database
                $assistantResponseData = [
                    'session_id' => $sessionId,
                    'role' => 'assistant',
                    'content' => $fullResponse
                ];
                
                // Add user_id for authenticated users
                if (Auth::check()) {
                    $assistantResponseData['user_id'] = Auth::id();
                }
                
                ChatMessage::create($assistantResponseData);
                
                // Send completion event
                echo "data: " . json_encode([
                    'type' => 'complete',
                    'fullResponse' => $fullResponse
                ]) . "\n\n";
                
            } catch (\Exception $e) {
                echo "data: " . json_encode([
                    'type' => 'error',
                    'content' => 'Failed to get response from assistant: ' . $e->getMessage()
                ]) . "\n\n";
            }
            
            ob_flush();
            flush();
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', // Disable Nginx buffering
        ]);
    }

    /**
     * Clear the current conversation
     */
    public function clearConversation()
    {
        // Clear the thread from session
        session()->forget('chat_thread_id');
        
        // Clear messages from database
        $this->getChatQuery()->delete();
        
        return response()->json(['success' => true]);
    }
}
