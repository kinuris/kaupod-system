# OpenAI Chatbot Setup Instructions

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI API key with access to the Assistants API.
2. **Assistant ID**: The assistant ID `asst_jorxunwvGeiVlsnNfJW8yfr6` is already configured in the system.

## Setup Steps

### 1. Configure Environment Variables

Update your `.env` file with your OpenAI API key:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=asst_jorxunwvGeiVlsnNfJW8yfr6
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 2. Verify Installation

The following components were installed and configured:

- **Backend**: OpenAI PHP client (`openai-php/client`)
- **Service**: `App\Services\OpenAIService` for handling API interactions
- **Controller**: Updated `ChatbotController` to use OpenAI Assistant API
- **Routes**: Added `/chat` page and API endpoints
- **Frontend**: React chatbot component with real-time messaging

### 3. Features Implemented

#### Backend Features:
- **Thread Management**: Creates and manages conversation threads
- **Message Handling**: Sends messages to OpenAI Assistant and retrieves responses
- **Session Persistence**: Maintains conversation state across page refreshes
- **Error Handling**: Comprehensive error handling and logging
- **Thread Cleanup**: Ability to clear conversations and delete threads

#### Frontend Features:
- **Real-time Chat Interface**: Modern chat UI with user and assistant messages
- **Loading States**: Shows "Thinking..." indicator during API calls
- **Message History**: Displays complete conversation history
- **Clear Conversation**: Button to start fresh conversations
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages

#### Navigation:
- **AI Assistant** link added to main navigation (both desktop and mobile)
- Available to both authenticated and guest users
- Purple color scheme to distinguish from other navigation items

### 4. Usage

#### For Users:
1. Click "AI Assistant" in the navigation menu
2. Start typing health-related questions or concerns
3. The AI will respond with helpful information and guidance
4. Use "Clear Chat" to start a fresh conversation

#### For Admins:
- All chat functionality is available to admin users
- No special admin controls needed for the chatbot feature

### 5. Security & Privacy

- **Thread-based Conversations**: Each session gets a unique thread ID
- **Session Management**: Threads are tied to user sessions
- **No Permanent Storage**: Conversations are not stored in the local database
- **OpenAI Privacy**: Follows OpenAI's data handling and privacy policies
- **Error Logging**: Errors are logged securely without exposing sensitive data

### 6. Troubleshooting

#### Common Issues:

1. **"Unable to start conversation"**
   - Check if OPENAI_API_KEY is set correctly
   - Verify API key has access to Assistants API
   - Check server logs for detailed error messages

2. **"Sorry, I am having trouble processing..."**
   - Check if the Assistant ID is correct
   - Verify the assistant is active in your OpenAI account
   - Check for API rate limits or quota issues

3. **Messages not appearing**
   - Check browser console for JavaScript errors
   - Verify CSRF token is being sent with requests
   - Check network tab for failed API calls

#### Logs Location:
- Laravel logs: `storage/logs/laravel.log`
- Look for "OpenAI" in log entries for debugging

### 7. Customization

#### To modify the assistant behavior:
1. Update the assistant configuration in your OpenAI dashboard
2. The assistant ID `asst_jorxunwvGeiVlsnNfJW8yfr6` is already configured

#### To modify the UI:
1. Edit `resources/js/components/chatbot.tsx` for the chat interface
2. Edit `resources/js/pages/chat.tsx` for the page layout
3. Update navigation in `resources/js/components/client-navigation.tsx`

### 8. API Endpoints

- `POST /chatbot/message`: Send message to assistant
- `POST /chatbot/clear`: Clear current conversation thread
- `GET /chat`: Display chatbot page

### 9. Performance Considerations

- **API Response Time**: Typically 1-5 seconds depending on query complexity
- **Rate Limits**: Respects OpenAI API rate limits
- **Session Management**: Threads are cleaned up when conversations are cleared
- **Error Timeout**: 30-second maximum wait time for responses

The chatbot is now fully integrated and ready for use! Users can access it via the "AI Assistant" link in the navigation menu.