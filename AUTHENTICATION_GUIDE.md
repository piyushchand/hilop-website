# Secure Authentication Implementation Guide

## Overview

This application implements a secure authentication system using **httpOnly cookies** and **server-side session management**. The system follows security best practices by avoiding client-side storage of sensitive data.

## 🔐 Security Features

### ✅ Secure Implementation
- **httpOnly Cookies**: Access tokens stored in httpOnly cookies (not accessible via JavaScript)
- **No localStorage**: No sensitive user data stored in browser localStorage
- **Server-side Validation**: All authentication checks performed server-side
- **Automatic Logout**: Automatic logout on token expiration
- **CSRF Protection**: Built-in protection through httpOnly cookies

### ❌ What We Don't Do
- Store access tokens in localStorage
- Store user data in localStorage
- Send tokens via URL parameters
- Expose sensitive data to client-side JavaScript

## 🔄 Authentication Flow

### 1. Login Process
```
User enters mobile → OTP sent → User verifies OTP → Cookies set → User data fetched → Navbar updates
```

### 2. Page Load Process
```
Page loads → AuthContext initializes → /api/auth/me called → User data fetched → UI updates
```

### 3. Route Protection
```
User visits protected route → Middleware checks cookies → Redirect to login if not authenticated
```

## 📁 Key Files

### Core Authentication
- `src/contexts/AuthContext.tsx` - Main authentication context
- `src/hooks/useRequireAuth.ts` - Hook for protected routes
- `src/middleware.ts` - Route protection middleware

### API Routes
- `src/app/api/auth/login/route.ts` - Login endpoint
- `src/app/api/auth/verify-otp/route.ts` - OTP verification (sets cookies)
- `src/app/api/auth/me/route.ts` - Get current user data
- `src/app/api/auth/logout/route.ts` - Logout (clears cookies)

### Components
- `src/components/Navbar.tsx` - Navigation with auth state
- `src/components/AuthDebugger.tsx` - Development debugging tool

## 🛠️ Usage Examples

### Protected Routes
```tsx
// In a protected page component
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProtectedPage() {
  const { user, isInitialized } = useRequireAuth();
  
  if (!isInitialized) return <Loading />;
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Authentication State in Components
```tsx
// In any component
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isLoading, isInitialized } = useAuth();
  
  if (!isInitialized) return <Loading />;
  
  return user ? <AuthenticatedView /> : <LoginPrompt />;
}
```

### Manual User Data Refresh
```tsx
// Refresh user data from server
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { refreshUserData } = useAuth();
  
  const handleRefresh = async () => {
    await refreshUserData();
  };
  
  return <button onClick={handleRefresh}>Refresh Profile</button>;
}
```

## 🔧 Development Tools

### Auth Debugger
The `AuthDebugger` component shows real-time authentication state in development:
- Current user information
- Loading states
- Error messages
- Manual refresh button

### Test Page
Visit `/test-auth` to see:
- Current authentication state
- Cookie status
- Security features overview
- Manual testing tools

## 🚀 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
- **Purpose**: Send OTP to mobile number
- **Body**: `{ mobile_number: string }`
- **Response**: `{ success: boolean, data: { user_id: string } }`

#### POST `/api/auth/verify-otp`
- **Purpose**: Verify OTP and authenticate user
- **Body**: `{ otp: string, user_id: string, type: 'login' | 'register' }`
- **Response**: Sets httpOnly cookies and returns user data
- **Cookies Set**: `accessToken`, `is_authenticated`

#### GET `/api/auth/me`
- **Purpose**: Get current user data
- **Headers**: Uses httpOnly cookies automatically
- **Response**: `{ success: boolean, data: User }`

#### POST `/api/auth/logout`
- **Purpose**: Logout user
- **Response**: Clears httpOnly cookies

## 🔒 Security Considerations

### Cookie Configuration
```typescript
// In verify-otp route
res.cookies.set('accessToken', token, {
  httpOnly: true,           // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax',         // CSRF protection
  path: '/',               // Available across the site
  maxAge: 60 * 60 * 24 * 365, // 1 year
});
```

### Middleware Protection
```typescript
// Protected routes automatically redirect to login
const protectedRoutes = [
  '/profile',
  '/my-order',
  '/cart',
  '/prescription',
  '/hilop-coins',
  '/book-call'
];
```

## 🧪 Testing

### Manual Testing
1. Visit `/test-auth` to see authentication state
2. Use browser dev tools to inspect cookies
3. Test login/logout flow
4. Verify protected route access

### Debug Console
Watch for these console messages:
- `🚀 Initializing auth state...`
- `🔄 Fetching user data from /api/auth/me...`
- `✅ User data fetched successfully`
- `🔒 Authentication required, redirecting to login`

## 🐛 Troubleshooting

### Common Issues

#### Navbar not updating after login
- Check if `/api/auth/me` is being called
- Verify cookies are set correctly
- Check browser console for errors

#### Protected routes not working
- Ensure middleware is configured correctly
- Check if cookies are present
- Verify route is in `protectedRoutes` array

#### User data not persisting
- Check if `refreshUserData()` is called on page load
- Verify `/api/auth/me` endpoint is working
- Check for 401 responses

### Debug Steps
1. Open browser dev tools
2. Check Application > Cookies
3. Look for `accessToken` and `is_authenticated` cookies
4. Check Network tab for `/api/auth/me` calls
5. Review console logs for authentication messages

## 📚 Best Practices

1. **Always use `useRequireAuth()` for protected pages**
2. **Never store sensitive data in localStorage**
3. **Always call `/api/auth/me` on page initialization**
4. **Use middleware for route protection**
5. **Handle loading states properly**
6. **Provide clear error messages to users**

## 🔄 Migration from localStorage

If migrating from a localStorage-based system:

1. Remove all `localStorage.setItem()` calls
2. Replace with `/api/auth/me` calls
3. Update components to use `useAuth()` hook
4. Add `useRequireAuth()` to protected pages
5. Update middleware configuration
6. Test all authentication flows

This implementation provides a secure, scalable authentication system that follows modern security best practices. 