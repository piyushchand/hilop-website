# Global Loading System Guide

## Overview
The application now has a global full-screen loading system that can be used anywhere in the app to show loading states during data fetching or async operations.

## Features
- ✅ Full-screen overlay with backdrop blur
- ✅ Animated Hilop logo
- ✅ Customizable loading messages
- ✅ Smooth animations using Framer Motion
- ✅ High z-index to appear above all content
- ✅ Responsive design

## How to Use

### 1. Basic Usage with useLoading Hook

```typescript
import { useLoading } from '@/contexts/LoadingContext';

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleDataFetch = async () => {
    try {
      showLoading("Fetching data...");
      const data = await fetch('/api/data');
      // Process data
    } finally {
      hideLoading();
    }
  };

  return <button onClick={handleDataFetch}>Load Data</button>;
}
```

### 2. Using the Utility Hook (Recommended)

```typescript
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

function MyComponent() {
  const { withLoading } = useGlobalLoading();

  const handleDataFetch = async () => {
    const data = await withLoading(
      async () => {
        const response = await fetch('/api/data');
        return response.json();
      },
      "Loading your data..."
    );
    
    // Data is automatically loaded and loading is hidden
    console.log(data);
  };

  return <button onClick={handleDataFetch}>Load Data</button>;
}
```

### 3. In Authentication Operations

The AuthContext already uses the global loading:

```typescript
// Login
await login("919876543210"); // Shows "Sending OTP..." loading

// Register
await register(userData); // Shows "Creating your account..." loading

// Verify OTP
await verifyOTP("123456", "user_id", "login"); // Shows "Verifying OTP..." loading
```

### 4. In Product Pages

Product pages automatically show loading when fetching product data:

```typescript
// In product/[id]/page.tsx
const fetchProduct = async () => {
  try {
    showLoading("Loading product details...");
    const response = await fetch(`/api/products/${productId}`);
    const data = await response.json();
    setProduct(data);
  } finally {
    hideLoading();
  }
};
```

## Loading Messages

You can customize the loading message for different operations:

```typescript
showLoading("Processing payment...");
showLoading("Saving your changes...");
showLoading("Uploading files...");
showLoading("Connecting to server...");
```

## Best Practices

1. **Always use try/finally**: Ensure loading is hidden even if an error occurs
2. **Use descriptive messages**: Tell users what's happening
3. **Use the utility hook**: `useGlobalLoading` handles the try/finally automatically
4. **Don't show loading for very fast operations**: Only use for operations that take noticeable time

## Example: Complete Component

```typescript
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { toast } from 'react-hot-toast';

function UserProfile() {
  const { withLoading } = useGlobalLoading();

  const updateProfile = async (userData) => {
    try {
      await withLoading(
        async () => {
          const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          
          if (!response.ok) {
            throw new Error('Failed to update profile');
          }
          
          return response.json();
        },
        "Updating your profile..."
      );
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={updateProfile}>
      {/* form fields */}
    </form>
  );
}
```

## Integration Points

The global loading is already integrated in:
- ✅ Authentication (login, register, OTP verification)
- ✅ Product pages (product data fetching)
- ✅ Home page (product list loading)
- ✅ All API calls can now use this system

## Technical Details

- **Component**: `LoadingSpinner.tsx`
- **Context**: `LoadingContext.tsx`
- **Utility Hook**: `useGlobalLoading.ts`
- **Z-Index**: 9999 (appears above all content)
- **Animation**: Framer Motion for smooth transitions
- **Backdrop**: Semi-transparent white with blur effect 

# Hilop Website - User Data Sync Guide

## Overview

This guide explains the user data synchronization system implemented to ensure real-time updates between the frontend and backend, preventing stale data issues and providing a seamless user experience.

## Key Features

### 1. Real-Time User Data Sync
- **Automatic Backend Sync**: User data is automatically synced with the backend on app initialization
- **Profile Update Sync**: Changes made to user profile are immediately reflected across the app
- **Token Validation**: Automatic token validation and user data refresh
- **Fallback Mechanisms**: Graceful handling of sync failures with local state updates

### 2. Authentication State Management
- **Initialization Tracking**: Tracks when auth state is fully initialized
- **Persistent Storage**: User data persists in localStorage with automatic sync
- **Error Handling**: Comprehensive error handling for network issues and token expiration

## API Endpoints

### `/api/auth/me` (GET)
Fetches current user profile data from the backend.
- **Authentication**: Requires valid access token cookie
- **Response**: Latest user data from backend
- **Error Handling**: 401 for expired tokens, 500 for server errors

### `/api/auth/update-profile` (PUT)
Updates user profile and returns the updated data.
- **Authentication**: Requires valid access token cookie
- **Request Body**: User profile updates
- **Response**: Updated user data from backend
- **Auto-Sync**: Automatically refreshes frontend state

## AuthContext Functions

### Core Functions
- `refreshUserData()`: Fetches latest user data from backend
- `syncUserWithBackend()`: Syncs local state with backend data
- `updateUser(updates)`: Updates local user state
- `isInitialized`: Boolean indicating if auth is fully initialized

### Usage Examples

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    user, 
    isInitialized, 
    refreshUserData, 
    updateUser 
  } = useAuth();

  // Wait for auth to be ready
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // Refresh user data
  const handleRefresh = async () => {
    const success = await refreshUserData();
    if (success) {
      console.log('User data refreshed');
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
}
```

## Profile Update Flow

1. **User makes changes** in AccountDetailsModal
2. **Form validation** ensures data integrity
3. **API call** to `/api/auth/update-profile`
4. **Backend processes** the update
5. **Response includes** updated user data
6. **Frontend refreshes** user data from backend
7. **Local state updates** with latest data
8. **UI reflects changes** immediately

## Error Handling

### Token Expiration
- Automatic detection of 401 responses
- Clear local auth data
- Redirect to login page

### Network Issues
- Retry logic for failed requests
- Fallback to local state updates
- User-friendly error messages

### Sync Failures
- Graceful degradation
- Local state preservation
- Manual refresh options

## Best Practices

### For Components
1. **Always check `isInitialized`** before rendering user data
2. **Use `refreshUserData()`** after profile updates
3. **Handle loading states** during sync operations
4. **Provide fallback UI** for error states

### For API Calls
1. **Return updated data** in profile update responses
2. **Handle authentication errors** consistently
3. **Provide meaningful error messages**
4. **Use proper HTTP status codes**

## Debugging

### Console Logs
The system provides detailed console logs for debugging:
- `🔄` - Sync operations
- `✅` - Successful operations
- `❌` - Failed operations
- `⚠️` - Warnings

### Common Issues
1. **Stale Data**: Use `refreshUserData()` to force sync
2. **Token Issues**: Check cookie expiration
3. **Network Errors**: Implement retry logic
4. **State Mismatch**: Verify backend response format

## Testing

### Manual Testing
1. Update profile information
2. Verify changes appear immediately
3. Refresh page and confirm persistence
4. Test with expired tokens
5. Test network connectivity issues

### Automated Testing
- Test auth initialization
- Test profile updates
- Test error scenarios
- Test token expiration
- Test network failures

## Migration Notes

### From Previous Version
- Remove manual localStorage management
- Use `refreshUserData()` instead of direct API calls
- Check `isInitialized` before rendering
- Update error handling to use new patterns

### Breaking Changes
- `AuthContext` now includes `isInitialized` state
- Profile updates automatically refresh data
- Token expiration handling is automatic
- Error states are more comprehensive 