<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function message(Request $request)
    {
        $validated = $request->validate(['message' => 'required|string|max:2000']);
        $history = session()->get('chat_convo', []);
        $history[] = ['role' => 'user', 'content' => $validated['message']];

        $assistantReply = 'Thank you for sharing. Could you tell me a bit more about your recent exposure or testing history?';
        $history[] = ['role' => 'assistant', 'content' => $assistantReply];
        session()->put('chat_convo', $history);

        return response()->json([
            'messages' => $history,
            'risk' => null,
        ]);
    }
}
