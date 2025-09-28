import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Trash2, Bot, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatbotProps {
    className?: string;
}

export default function Chatbot({ className }: ChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom);
        }
    };

    // Removed auto-scroll to prevent scrolling during bot responses

    useEffect(() => {
        // Add welcome message when component mounts
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: 'Hello! I\'m here to help you with any health-related questions or concerns you might have. Feel free to share what\'s on your mind, and I\'ll do my best to provide helpful information and guidance.'
            }]);
        }
    }, [messages.length]);

    const sendMessage = async (userMessage: string) => {
        if (!userMessage.trim()) return;

        // Add user message immediately
        const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);
        setError(null);
        
        // Scroll to bottom when user sends a message
        setTimeout(() => scrollToBottom(), 100);

        try {
            // Get CSRF token from meta tag
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/chatbot/message/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain',
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ message: userMessage }),
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Failed to start streaming response');
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Unable to read streaming response');
            }

            const decoder = new TextDecoder();
            let assistantMessage = '';
            let messagesWithAssistant = [...newMessages, { role: 'assistant' as const, content: '' }];

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                
                                switch (data.type) {
                                    case 'start':
                                        // Stream started
                                        break;
                                        
                                    case 'chunk':
                                        assistantMessage += data.content;
                                        messagesWithAssistant = [
                                            ...newMessages,
                                            { role: 'assistant' as const, content: assistantMessage }
                                        ];
                                        setMessages(messagesWithAssistant);
                                        break;
                                        
                                    case 'complete':
                                        // Stream completed
                                        setIsLoading(false);
                                        break;
                                        
                                    case 'error':
                                        throw new Error(data.content);
                                }
                            } catch {
                                // Skip invalid JSON lines
                                continue;
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            // Remove the user message if there was an error
            setMessages(messages);
        } finally {
            setIsLoading(false);
        }
    };    const clearConversation = async () => {
        setIsLoading(true);
        try {
            // Get CSRF token from meta tag
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/chatbot/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                setMessages([{
                    role: 'assistant',
                    content: 'Hello! I\'m here to help you with any health-related questions or concerns you might have. Feel free to share what\'s on your mind, and I\'ll do my best to provide helpful information and guidance.'
                }]);
                setError(null);
                setTimeout(() => scrollToBottom(), 100);
            }
        } catch {
            setError('Failed to clear conversation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    return (
        <Card className={cn('flex flex-col h-[600px] bg-white border-gray-200 shadow-sm', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-900">
                    <Bot className="h-5 w-5 text-red-600" />
                    Health Assistant
                </CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearConversation}
                    disabled={isLoading || messages.length <= 1}
                    className="text-xs"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Chat
                </Button>
            </CardHeader>
            
            <CardContent className="flex flex-col flex-1 p-4 space-y-4 bg-white">
                <div className="flex-1 overflow-y-auto pr-4 relative" ref={messagesContainerRef} onScroll={handleScroll}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'flex items-start gap-3',
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                {message.role === 'assistant' && (
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-red-600" />
                                    </div>
                                )}
                                
                                <div
                                    className={cn(
                                        'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                                        message.role === 'user'
                                            ? 'bg-red-600 text-white ml-12'
                                            : 'bg-gray-100 dark:bg-gray-100 text-gray-900 dark:text-gray-900 mr-12'
                                    )}
                                >
                                    <div className="whitespace-pre-wrap break-words">
                                        {message.content}
                                    </div>
                                </div>
                                
                                {message.role === 'user' && (
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-red-600" />
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-100 rounded-lg px-4 py-2 text-sm mr-12">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-600" />
                                        <span className="text-gray-600 dark:text-gray-600">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {showScrollButton && (
                        <Button
                            onClick={scrollToBottom}
                            size="sm"
                            variant="outline"
                            className="absolute bottom-4 right-8 h-8 w-8 p-0 rounded-full bg-white shadow-lg border-red-200 hover:bg-red-50"
                        >
                            <ChevronDown className="h-4 w-4 text-red-600" />
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="flex-1"
                        maxLength={2000}
                    />
                    <Button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        size="sm"
                        className="px-3"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>

                <div className="text-xs text-gray-600 dark:text-gray-600 text-center">
                    This AI assistant provides general health information only. Always consult healthcare professionals for medical advice.
                </div>
            </CardContent>
        </Card>
    );
}