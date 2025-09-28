# Kaupod System - Complete Development Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Development Setup](#development-setup)
5. [Core Features Implementation](#core-features-implementation)
6. [Database Design](#database-design)
7. [Frontend Development](#frontend-development)
8. [Backend Development](#backend-development)
9. [Authentication & Authorization](#authentication--authorization)
10. [AI Chatbot Integration](#ai-chatbot-integration)
11. [File Structure](#file-structure)
12. [Deployment](#deployment)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

## Project Overview

**Kaupod** is a comprehensive reproductive health care platform that provides:
- **HIV Testing Kit Orders**: Discrete delivery and pickup of testing kits
- **Expert Medical Consultations**: Professional healthcare consultations with partner doctors
- **AI Health Assistant**: OpenAI-powered chatbot for health-related queries
- **Order & Consultation Tracking**: Real-time status updates and timeline tracking
- **Admin Management System**: Complete backend for managing orders, consultations, and users

### Key Features
- User registration and authentication with 2FA support
- Kit order management with GPS-precise delivery locations
- Consultation booking with flexible scheduling
- Real-time streaming AI chatbot
- Comprehensive admin dashboard
- Mobile-responsive design
- Timeline tracking for orders and consultations

## Technology Stack

### Backend
- **Framework**: Laravel 12.0
- **Language**: PHP 8.2+
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: Laravel Fortify with 2FA
- **Real-time**: Server-Sent Events (SSE)
- **API Integration**: OpenAI Assistant API v0.16.1

### Frontend
- **Framework**: React 19.0+ with TypeScript
- **Routing**: Inertia.js 2.1.4
- **Styling**: Tailwind CSS 4.1.11
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks

### Development Tools
- **Code Quality**: ESLint, Prettier, TypeScript
- **Testing**: Pest (PHP), PHPUnit
- **Package Manager**: Composer (PHP), npm (Node.js)
- **Version Control**: Git

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React/Inertia │    │   Laravel API   │    │   OpenAI API    │
│   Frontend      │◄──►│   Backend       │◄──►│   Assistant     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   SQLite/MySQL  │              │
         │              │   Database      │              │
         │              └─────────────────┘              │
         │                                               │
         ▼                                               ▼
┌─────────────────┐                            ┌─────────────────┐
│   File Storage  │                            │   Session Store │
│   (Uploads)     │                            │   (Threads)     │
└─────────────────┘                            └─────────────────┘
```

## Development Setup

### Prerequisites
- PHP 8.2 or higher
- Node.js 18+ and npm
- Composer
- SQLite (for development)

### Step 1: Initial Setup

```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd kaupod-system

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 2: Environment Configuration

Edit `.env` file with the following key configurations:

```env
# Application
APP_NAME=Kaupod
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database/database.sqlite

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=asst_jorxunwvGeiVlsnNfJW8yfr6

# Vite
VITE_APP_NAME="${APP_NAME}"
```

### Step 3: Database Setup

```bash
# Create SQLite database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# (Optional) Seed database with sample data
php artisan db:seed
```

### Step 4: Frontend Build

```bash
# Development build with hot reload
npm run dev

# Or production build
npm run build
```

### Step 5: Start Development Server

```bash
# Start Laravel development server
php artisan serve

# In another terminal, start Vite dev server (if using npm run dev)
npm run dev
```

Access the application at `http://localhost:8000`

## Core Features Implementation

### 1. User Authentication System

**Files Involved:**
- `app/Models/User.php` - User model with relationships
- `config/fortify.php` - Authentication configuration
- `resources/js/pages/auth/` - Authentication pages

**Key Features:**
- User registration with email verification
- Login/logout functionality
- Two-factor authentication (2FA)
- Password reset functionality
- Role-based access (admin/client)

### 2. Kit Order Management

**Backend Components:**
- `app/Models/KitOrder.php` - Kit order model
- `app/Http/Controllers/KitOrderController.php` - Order processing
- `app/Enums/KitOrderStatus.php` - Status definitions
- `app/Services/PriceCalculator.php` - Dynamic pricing

**Frontend Components:**
- `resources/js/pages/request/kit.tsx` - Order form
- `resources/js/pages/my-orders.tsx` - Order tracking
- `resources/js/components/delivery-location-map.tsx` - Location picker

**Key Features:**
- GPS-precise delivery location selection
- Real-time order status tracking
- Timeline visualization
- Age confirmation modal
- Ongoing order prevention
- Admin status management

### 3. Consultation Management

**Backend Components:**
- `app/Models/ConsultationRequest.php` - Consultation model
- `app/Http/Controllers/ConsultationRequestController.php` - Booking logic
- `app/Models/PartnerDoctor.php` - Doctor assignments

**Frontend Components:**
- `resources/js/pages/request/consultation.tsx` - Booking form
- `resources/js/pages/consultation-tracker.tsx` - Enhanced tracking
- `resources/js/pages/my-orders.tsx` - Order overview

**Key Features:**
- Flexible scheduling with date/time preferences
- Multiple consultation types and modes
- Partner doctor assignment
- Rescheduling functionality
- Timeline with status icons

### 4. AI Chatbot System

**Backend Components:**
- `app/Services/OpenAIService.php` - OpenAI integration
- `app/Http/Controllers/ChatbotController.php` - Chat endpoints
- `app/Models/ChatMessage.php` - Message persistence

**Frontend Components:**
- `resources/js/components/chatbot.tsx` - Chat interface
- `resources/js/pages/chat.tsx` - Chat page

**Key Features:**
- OpenAI Assistant API integration
- Streaming responses with Server-Sent Events
- Message persistence across sessions
- User-based conversation threads
- Real-time typing indicators

### 5. Admin Dashboard

**Components:**
- `resources/js/pages/admin/` - Admin pages
- `resources/js/layouts/app-layout.tsx` - Admin layout
- `resources/js/components/app-sidebar.tsx` - Navigation

**Key Features:**
- Kit order management
- Consultation request handling
- User management
- Partner doctor management
- Status updates and timeline management

## Database Design

### Core Tables

#### Users Table
```sql
- id (primary key)
- name, email, email_verified_at
- password, remember_token
- role (admin/client)  
- personal_info (JSON)
- two_factor_secret, two_factor_recovery_codes
- two_factor_confirmed_at
- timestamps
```

#### Kit Orders Table
```sql
- id (primary key)
- user_id (foreign key)
- phone, price
- delivery_notes, delivery_address
- delivery_latitude, delivery_longitude
- delivery_location_address
- return_* fields (return logistics)
- status (enum)
- timeline (JSON)
- result_email_sent, result_email_sent_at
- timestamps
```

#### Consultation Requests Table
```sql
- id (primary key)
- user_id (foreign key)
- phone, preferred_date, preferred_time
- consultation_type, consultation_mode
- consultation_latitude, consultation_longitude
- consultation_location_address
- reason, medical_history
- status (enum)
- assigned_partner_doctor_id
- scheduled_datetime, confirmed_datetime
- rescheduling_reason, last_rescheduled_at
- timeline (JSON)
- timestamps
```

#### Chat Messages Table
```sql
- id (primary key)
- user_id (foreign key)
- session_id
- role (user/assistant)
- content (text)
- timestamps
```

#### Partner Doctors Table
```sql
- id (primary key)
- name, specialization
- contact_email, contact_phone
- is_available (boolean)
- timestamps
```

### Relationships
- User → hasMany → KitOrders
- User → hasMany → ConsultationRequests  
- User → hasMany → ChatMessages
- ConsultationRequest → belongsTo → PartnerDoctor
- ConsultationRequest → belongsTo → User

## Frontend Development

### Component Architecture

```
resources/js/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs)
│   ├── app-header.tsx   # Admin header
│   ├── app-sidebar.tsx  # Admin sidebar
│   ├── chatbot.tsx      # AI chatbot component
│   └── client-navigation.tsx # Client navigation
├── layouts/             # Page layouts
│   ├── app-layout.tsx   # Admin layout
│   └── guest-layout.tsx # Guest layout
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── auth/            # Authentication pages
│   ├── request/         # Request forms
│   └── settings/        # User settings
└── hooks/               # Custom React hooks
```

### Key React Patterns Used

1. **Custom Hooks**: `use-appearance.ts` for theme management
2. **Compound Components**: UI components with sub-components
3. **Form Handling**: Inertia.js Form component with validation
4. **State Management**: React hooks (useState, useEffect)
5. **Event Handling**: SSE for real-time chat streaming

### Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Component Variants**: Using `class-variance-authority`
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection
- **Color Scheme**: Red primary colors for brand consistency

## Backend Development

### Laravel Architecture

```
app/
├── Enums/               # Status enumerations
├── Http/
│   ├── Controllers/     # Request handlers
│   ├── Middleware/      # Custom middleware
│   └── Requests/        # Form request validation
├── Models/              # Eloquent models
├── Policies/            # Authorization policies
├── Providers/           # Service providers
└── Services/            # Business logic services
```

### Key Design Patterns

1. **Service Layer**: `OpenAIService`, `PriceCalculator`
2. **Enum Classes**: Type-safe status definitions
3. **Form Requests**: Input validation and authorization
4. **Eloquent Relationships**: Database relationships
5. **Event Broadcasting**: Real-time updates (potential)

### API Endpoints

#### Authentication Routes
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout
- `POST /password/email` - Password reset request
- `POST /password/reset` - Password reset

#### Client Routes
- `GET /request/kit` - Kit order form
- `POST /request/kit` - Submit kit order
- `GET /request/consultation` - Consultation form
- `POST /request/consultation` - Submit consultation
- `GET /my-orders` - Order tracking
- `GET /consultation-tracker` - Consultation tracking

#### Admin Routes
- `GET /admin/kit-orders` - Kit order management
- `GET /admin/consultation-requests` - Consultation management
- `PATCH /admin/kit-orders/{id}/status` - Update order status

#### Chatbot Routes
- `GET /chatbot/messages` - Get chat history
- `POST /chatbot/message` - Send message
- `GET /chatbot/message-stream` - Streaming endpoint
- `DELETE /chatbot/clear` - Clear conversation

## Authentication & Authorization

### Laravel Fortify Configuration

**Two-Factor Authentication:**
- QR code generation for authenticator apps
- Recovery codes for backup access
- Email verification requirement

**Role-Based Access:**
- Admin role: Full system access
- Client role: Limited to own data

### Frontend Authentication

**Protected Routes:**
- Automatic redirects for unauthenticated users
- Role-based page access
- Session persistence

**Security Features:**
- CSRF protection on all forms
- XSS protection via React
- SQL injection prevention via Eloquent ORM

## AI Chatbot Integration

### OpenAI Assistant Configuration

**Setup Steps:**
1. Create OpenAI Assistant in OpenAI Console
2. Configure assistant with health-focused instructions
3. Set assistant ID in environment variables
4. Implement streaming response handling

### Backend Implementation

```php
// app/Services/OpenAIService.php
class OpenAIService {
    public function createThread(): ?string
    public function sendMessage(string $threadId, string $message): ?string
    public function sendMessageStream(string $threadId, string $message): Generator
    public function deleteThread(string $threadId): bool
    public function getConversationHistory(string $threadId): array
}
```

### Frontend Implementation

```typescript
// Streaming message handling
const sendMessage = async (message: string) => {
    const response = await fetch('/chatbot/message-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    
    const reader = response.body?.getReader();
    // Process streaming chunks...
};
```

### Key Features
- Thread-based conversations
- Message persistence in database
- Streaming responses for better UX
- Error handling and fallbacks
- User-specific chat sessions

## File Structure

### Important Configuration Files

```
├── .env                 # Environment configuration
├── composer.json        # PHP dependencies
├── package.json         # Node.js dependencies
├── vite.config.ts       # Vite build configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── phpunit.xml          # PHP testing configuration
```

### Key Directories

```
├── app/                 # Laravel application code
├── bootstrap/           # Laravel bootstrap files
├── config/              # Configuration files
├── database/            # Migrations, seeders, factories
├── public/              # Web-accessible files
├── resources/           # Frontend assets and views
├── routes/              # Route definitions
├── storage/             # File storage and logs
├── tests/               # Test files
└── vendor/              # PHP dependencies
```

## Deployment

### Production Environment Setup

1. **Server Requirements:**
   - PHP 8.2+
   - Node.js 18+
   - MySQL 8.0+
   - Web server (Apache/Nginx)

2. **Environment Configuration:**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION=mysql
   # Production database credentials
   ```

3. **Build Process:**
   ```bash
   composer install --optimize-autoloader --no-dev
   npm run build
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Database Migration:**
   ```bash
   php artisan migrate --force
   ```

5. **File Permissions:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Frontend assets built
- [ ] Laravel caches cleared
- [ ] File permissions set
- [ ] SSL certificate installed
- [ ] OpenAI API key configured
- [ ] Email configuration tested

## Testing

### Backend Testing (Pest/PHPUnit)

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

### Frontend Testing

```bash
# Type checking
npm run types

# Linting
npm run lint

# Format checking
npm run format:check
```

### Key Test Areas

1. **Authentication Tests**
   - User registration/login
   - Two-factor authentication
   - Password reset functionality

2. **API Tests**
   - Kit order creation
   - Consultation booking
   - Chatbot messaging

3. **Integration Tests**
   - End-to-end user flows
   - OpenAI API integration
   - Database operations

## Troubleshooting

### Common Issues

1. **OpenAI API Connection Issues**
   ```bash
   # Check API key configuration
   php artisan config:clear
   
   # Verify environment variables
   php artisan tinker
   >>> config('services.openai.api_key')
   ```

2. **Frontend Build Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Database Migration Issues**
   ```bash
   # Reset database
   php artisan migrate:fresh
   
   # Check database connection
   php artisan migrate:status
   ```

4. **Permission Issues**
   ```bash
   # Fix storage permissions
   chmod -R 755 storage
   chmod -R 755 bootstrap/cache
   ```

### Performance Optimization

1. **Laravel Optimizations**
   - Route caching: `php artisan route:cache`
   - Config caching: `php artisan config:cache`
   - View caching: `php artisan view:cache`

2. **Frontend Optimizations**
   - Code splitting with dynamic imports
   - Image optimization
   - CSS purging with Tailwind

3. **Database Optimizations**
   - Add indexes for frequently queried columns
   - Optimize N+1 queries with eager loading
   - Use database query caching

### Monitoring & Logging

1. **Laravel Logs**
   - Location: `storage/logs/laravel.log`
   - Levels: emergency, alert, critical, error, warning, notice, info, debug

2. **Frontend Error Tracking**
   - Console errors for debugging
   - Network request monitoring
   - Performance metrics

3. **OpenAI API Monitoring**
   - Request/response logging
   - Rate limit monitoring
   - Error rate tracking

## Development Best Practices

### Code Quality
- Follow PSR-12 coding standards for PHP
- Use TypeScript for type safety
- Implement proper error handling
- Write comprehensive tests
- Use meaningful commit messages

### Security
- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Keep dependencies updated
- Use HTTPS in production

### Performance
- Optimize database queries
- Implement caching strategies
- Minimize bundle sizes
- Use lazy loading for images
- Implement proper error boundaries

---

This documentation provides a comprehensive guide for understanding and developing the Kaupod system. For specific implementation details, refer to the individual files and components mentioned throughout this guide.