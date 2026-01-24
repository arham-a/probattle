# Authentication Integration

This document outlines the authentication integration between the Next.js client and Express.js server.

## Overview

The authentication system includes:
- JWT-based authentication with access and refresh tokens
- Axios interceptors for automatic token management
- React Context for global authentication state
- Protected routes for authenticated pages
- Clean API structure with separate service files

## Architecture

### Client-Side Structure

```
client/
├── lib/api/
│   ├── config.ts          # Axios configuration and interceptors
│   ├── auth.ts            # Authentication API service
│   ├── services.ts        # Services API service
│   ├── bookings.ts        # Bookings API service
│   ├── users.ts           # Users API service
│   └── index.ts           # API exports
├── contexts/
│   └── AuthContext.tsx    # Authentication context provider
├── components/
│   └── ProtectedRoute.tsx # Route protection component
└── app/
    ├── providers.tsx      # Updated with AuthProvider
    ├── login/page.tsx     # Login page with real API integration
    ├── register/page.tsx  # Register page with real API integration
    └── dashboard/page.tsx # Protected dashboard
```

### Server-Side Integration

The server already has:
- JWT authentication with refresh tokens (`/api/auth/*`)
- User management (`/api/users/*`)
- Services management (`/api/services/*`)
- Bookings management (`/api/bookings/*`)

## Key Features

### 1. Axios Configuration (`lib/api/config.ts`)

- Base URL: `http://localhost:5000/api`
- Automatic token attachment to requests
- Token refresh on 401 errors
- Automatic redirect to login on auth failure

### 2. Authentication Context (`contexts/AuthContext.tsx`)

Provides:
- `user`: Current user object
- `isLoading`: Loading state
- `isAuthenticated`: Authentication status
- `login(credentials)`: Login function
- `register(userData)`: Registration function
- `logout()`: Logout function
- `refreshUser()`: Refresh user data

### 3. Protected Routes (`components/ProtectedRoute.tsx`)

- Automatically redirects unauthenticated users to login
- Shows loading spinner during auth check
- Supports both protected and public routes

### 4. API Services

Each API service is organized by domain:
- **Auth Service**: Login, register, logout, token refresh
- **Services Service**: CRUD operations for services
- **Bookings Service**: Booking management
- **Users Service**: User profile management

## Usage Examples

### Using Authentication Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.name}!</div>;
}
```

### Making API Calls

```tsx
import { servicesService } from '@/lib/api';

// Get services
const services = await servicesService.getServices();

// Create service
const newService = await servicesService.createService({
  title: 'My Service',
  description: 'Service description',
  // ... other fields
});
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

## Authentication Flow

1. **Login/Register**: User submits credentials
2. **Token Storage**: Access and refresh tokens stored in localStorage
3. **API Requests**: Access token automatically attached to requests
4. **Token Refresh**: On 401 error, refresh token used to get new access token
5. **Logout**: Tokens cleared and user redirected

## Security Features

- Automatic token refresh
- Secure token storage
- Request/response interceptors
- Protected route guards
- Server-side token validation

## Environment Configuration

Make sure the server is running on `http://localhost:5000` or update the `API_BASE_URL` in `lib/api/config.ts`.

## Next Steps

1. Test the authentication flow by running both client and server
2. Implement additional API endpoints as needed
3. Add error handling and user feedback
4. Implement role-based access control
5. Add loading states and better UX