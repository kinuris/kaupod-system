<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\OpenAIService;
use Illuminate\Support\Facades\Log;

class TestOpenAI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:openai {message?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test OpenAI Assistant integration';

    /**
     * Execute the console command.
     */
    public function handle(OpenAIService $openAIService)
    {
        $this->info('🤖 Testing OpenAI Assistant Integration...');
        $this->newLine();

        // Check configuration
        $this->info('📋 Configuration Check:');
        $apiKey = config('services.openai.api_key');
        $assistantId = config('services.openai.assistant_id');

        if (empty($apiKey)) {
            $this->error('❌ OPENAI_API_KEY is not set in .env file');
            return 1;
        }

        if (empty($assistantId)) {
            $this->error('❌ OPENAI_ASSISTANT_ID is not set in .env file');
            return 1;
        }

        $this->info("✅ API Key: " . substr($apiKey, 0, 8) . "..." . substr($apiKey, -4));
        $this->info("✅ Assistant ID: {$assistantId}");
        $this->newLine();

        // Test thread creation
        $this->info('🧵 Testing Thread Creation...');
        $threadId = $openAIService->createThread();

        if (!$threadId) {
            $this->error('❌ Failed to create thread');
            return 1;
        }

        $this->info("✅ Thread created: {$threadId}");
        $this->newLine();

        // Test streaming message sending
        $testMessage = $this->argument('message') ?? 'Hello, I have some questions about HIV testing. Can you help me?';
        $this->info("💬 Testing Streaming Message: \"{$testMessage}\"");
        $this->info('⏳ Streaming response from assistant...');
        $this->line('───────────────────────────────────────');

        $fullResponse = '';
        foreach ($openAIService->sendMessageStream($threadId, $testMessage) as $chunk) {
            // Check if chunk is an error
            if (strpos($chunk, '{"error"') === 0) {
                $this->error('❌ Error: ' . json_decode($chunk, true)['error']);
                $openAIService->deleteThread($threadId);
                return 1;
            }
            
            $fullResponse .= $chunk;
            $this->getOutput()->write($chunk);
        }

        $this->newLine();
        $this->line('───────────────────────────────────────');
        $this->info('✅ Streaming completed successfully!');
        $this->newLine();

        // Test conversation history
        $this->info('📜 Testing Conversation History...');
        $history = $openAIService->getConversationHistory($threadId);

        if (empty($history)) {
            $this->warn('⚠️  No conversation history retrieved');
        } else {
            $this->info("✅ Retrieved {" . count($history) . "} messages from history");
            foreach ($history as $index => $message) {
                $role = ucfirst($message['role']);
                $content = substr($message['content'], 0, 100) . (strlen($message['content']) > 100 ? '...' : '');
                $this->line("  {$index}. [{$role}]: {$content}");
            }
        }
        $this->newLine();

        // Test thread cleanup
        $this->info('🧹 Testing Thread Cleanup...');
        $deleted = $openAIService->deleteThread($threadId);

        if ($deleted) {
            $this->info('✅ Thread deleted successfully');
        } else {
            $this->warn('⚠️  Thread deletion may have failed (check logs)');
        }

        $this->newLine();
        $this->info('🎉 OpenAI Assistant test completed successfully!');
        $this->info('💡 You can now test the web interface at: /chat');

        return 0;
    }
}
