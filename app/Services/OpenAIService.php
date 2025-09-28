<?php

namespace App\Services;

use OpenAI;
use Illuminate\Support\Facades\Log;
use Exception;

class OpenAIService
{
    private $client;
    private $assistantId;

    public function __construct()
    {
        $this->client = OpenAI::client(config('services.openai.api_key'));
        $this->assistantId = config('services.openai.assistant_id');
    }

    /**
     * Create a new thread for the conversation
     */
    public function createThread(): ?string
    {
        try {
            $thread = $this->client->threads()->create([]);
            
            return $thread->id;
        } catch (Exception $e) {
            Log::error('Failed to create OpenAI thread: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Send a message to the assistant and get a response
     */
    public function sendMessage(string $threadId, string $message): ?string
    {
        try {
            // Add the user message to the thread
            $this->client->threads()->messages()->create($threadId, [
                'role' => 'user',
                'content' => $message,
            ]);

            // Create a run with the assistant
            $run = $this->client->threads()->runs()->create($threadId, [
                'assistant_id' => $this->assistantId,
            ]);

            // Poll for completion
            $runId = $run->id;
            $maxAttempts = 30; // Maximum 30 seconds
            $attempts = 0;

            do {
                sleep(1);
                $runStatus = $this->client->threads()->runs()->retrieve($threadId, $runId);
                $attempts++;
            } while ($runStatus->status === 'in_progress' && $attempts < $maxAttempts);

            if ($runStatus->status !== 'completed') {
                Log::error('OpenAI run did not complete successfully. Status: ' . $runStatus->status);
                return null;
            }

            // Retrieve the assistant's response
            $messages = $this->client->threads()->messages()->list($threadId, [
                'limit' => 1,
            ]);

            if (empty($messages->data)) {
                return null;
            }

            $lastMessage = $messages->data[0];
            
            if ($lastMessage->role === 'assistant' && !empty($lastMessage->content)) {
                return $lastMessage->content[0]->text->value ?? null;
            }

            return null;
        } catch (Exception $e) {
            Log::error('Failed to send message to OpenAI: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Send a message to the assistant and simulate streaming by polling
     */
    public function sendMessageStream(string $threadId, string $message): \Generator
    {
        try {
            // Add the user message to the thread
            $this->client->threads()->messages()->create($threadId, [
                'role' => 'user',
                'content' => $message,
            ]);

            // Create a run with the assistant
            $run = $this->client->threads()->runs()->create($threadId, [
                'assistant_id' => $this->assistantId,
            ]);

            $runId = $run->id;
            $lastCheckedMessageId = null;
            $maxAttempts = 30;
            $attempts = 0;

            // Poll for completion while streaming partial updates
            do {
                sleep(1);
                $runStatus = $this->client->threads()->runs()->retrieve($threadId, $runId);
                $attempts++;

                // Check for new message content periodically
                if ($attempts % 2 === 0) { // Check every 2 seconds
                    try {
                        $messages = $this->client->threads()->messages()->list($threadId, [
                            'limit' => 1,
                        ]);

                        if (!empty($messages->data)) {
                            $latestMessage = $messages->data[0];
                            if ($latestMessage->role === 'assistant' && 
                                $latestMessage->id !== $lastCheckedMessageId &&
                                !empty($latestMessage->content)) {
                                
                                $content = $latestMessage->content[0]->text->value ?? '';
                                
                                if ($content) {
                                    // If this is a new message or updated content, yield it
                                    if ($lastCheckedMessageId !== $latestMessage->id) {
                                        // Simulate streaming by breaking content into chunks
                                        $words = explode(' ', $content);
                                        $chunksSize = max(1, intval(count($words) / 8)); // 8 chunks
                                        
                                        for ($i = 0; $i < count($words); $i += $chunksSize) {
                                            $chunk = implode(' ', array_slice($words, $i, $chunksSize));
                                            if ($i + $chunksSize < count($words)) {
                                                $chunk .= ' ';
                                            }
                                            yield $chunk;
                                            usleep(200000); // 200ms delay between chunks
                                        }
                                        
                                        $lastCheckedMessageId = $latestMessage->id;
                                        break; // Exit the polling loop once we have the response
                                    }
                                }
                            }
                        }
                    } catch (Exception $e) {
                        // Continue polling if message retrieval fails
                        Log::warning('Failed to retrieve messages during streaming: ' . $e->getMessage());
                    }
                }

            } while ($runStatus->status === 'in_progress' && $attempts < $maxAttempts);

            // If we haven't streamed the response yet, get it now
            if (!$lastCheckedMessageId) {
                if ($runStatus->status !== 'completed') {
                    Log::error('OpenAI run did not complete successfully. Status: ' . $runStatus->status);
                    yield json_encode(['error' => 'Assistant run timed out or failed']);
                    return;
                }

                // Retrieve the final response
                $messages = $this->client->threads()->messages()->list($threadId, [
                    'limit' => 1,
                ]);

                if (!empty($messages->data)) {
                    $lastMessage = $messages->data[0];
                    
                    if ($lastMessage->role === 'assistant' && !empty($lastMessage->content)) {
                        $content = $lastMessage->content[0]->text->value ?? '';
                        if ($content) {
                            // Stream the response in chunks
                            $words = explode(' ', $content);
                            $chunksSize = max(1, intval(count($words) / 8));
                            
                            for ($i = 0; $i < count($words); $i += $chunksSize) {
                                $chunk = implode(' ', array_slice($words, $i, $chunksSize));
                                if ($i + $chunksSize < count($words)) {
                                    $chunk .= ' ';
                                }
                                yield $chunk;
                                usleep(200000); // 200ms delay between chunks
                            }
                        }
                    }
                }
            }

        } catch (Exception $e) {
            Log::error('Failed to stream message from OpenAI: ' . $e->getMessage());
            yield json_encode(['error' => 'Failed to get response from assistant']);
        }
    }

    /**
     * Get conversation history from a thread
     */
    public function getConversationHistory(string $threadId): array
    {
        try {
            $messages = $this->client->threads()->messages()->list($threadId);
            
            $history = [];
            foreach (array_reverse($messages->data) as $message) {
                $content = $message->content[0]->text->value ?? '';
                $history[] = [
                    'role' => $message->role,
                    'content' => $content,
                    'created_at' => $message->created_at,
                ];
            }

            return $history;
        } catch (Exception $e) {
            Log::error('Failed to get conversation history: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Delete a thread when conversation is done
     */
    public function deleteThread(string $threadId): bool
    {
        try {
            $this->client->threads()->delete($threadId);
            return true;
        } catch (Exception $e) {
            Log::error('Failed to delete OpenAI thread: ' . $e->getMessage());
            return false;
        }
    }
}