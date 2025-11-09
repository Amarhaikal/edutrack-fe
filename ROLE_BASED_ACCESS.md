# Role-Based Access Control (RBAC) Implementation

## Overview

This document explains the role-based access control implementation in the EduTrack application.

## Components

### 1. ProtectedRoute Component

Location: [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)

A wrapper component that checks user authentication and role permissions before rendering protected routes.

**Usage:**
```tsx
<ProtectedRoute allowedRoles={['Admin']}>
  <User />
</ProtectedRoute>
```

**Parameters:**
- `children`: The component to render if access is granted
- `allowedRoles`: Array of role names that can access this route (optional)
  - If not provided, any authenticated user can access
  - Role checking is case-insensitive

**Behavior:**
- Shows loading state while checking authentication
- Redirects to login if user is not authenticated
- Redirects to unauthorized page if user doesn't have required role
- Renders children if user has access

### 2. UnauthorizedAccess Component

Location: [src/components/UnauthorizedAccess.tsx](src/components/UnauthorizedAccess.tsx)

Displays a user-friendly message when access is denied due to insufficient permissions.

## Route Protection

### Protected Routes in App.tsx

```tsx
// Admin-only routes
<Route
  path="users"
  element={
    <ProtectedRoute allowedRoles={['Admin']}>
      <User />
    </ProtectedRoute>
  }
/>

<Route
  path="users/add"
  element={
    <ProtectedRoute allowedRoles={['Admin']}>
      <UserForm />
    </ProtectedRoute>
  }
/>

// Available to all authenticated users
<Route path="settings/profile" element={<Profile />} />
```

## Authentication Context

Location: [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)

### User Data Storage

**Is it a good practice to store user data in AuthContext?**

✅ **YES!** This is the recommended approach because:

1. **Centralized State Management**: Single source of truth for authentication state
2. **Easy Access**: Available throughout the app via `useAuth()` hook
3. **Consistent**: Data comes from trusted login API response
4. **Reactive**: Automatically updates all components when auth state changes
5. **Standard Pattern**: Widely used in React applications

### User Interface

```tsx
interface RefRole {
  id: number;
  code: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  idno: string;
  email: string;
  role: RefRole;  // Role object with id, code, and description
}
```

**Example user object from API:**
```json
{
  "id": 13,
  "name": "hayati",
  "idno": "010101010101",
  "email": "hayati@example.com",
  "role": {
    "id": 2,
    "code": "LECT",
    "description": "Lecturer"
  }
}
```

The `ProtectedRoute` component uses `user.role.description` to check permissions (e.g., "Admin", "Lecturer").

### Available Auth Methods

```tsx
const { user, token, isAuthenticated, login, logout, checkTokenExpiration } = useAuth();
```

## How It Works

### Flow Diagram

```
User navigates to /edutrack/users
           ↓
ProtectedRoute checks authentication
           ↓
    Is authenticated?
       ↙     ↘
     No      Yes
      ↓       ↓
  Redirect   Check role
  to login      ↓
           Has Admin role?
              ↙     ↘
            No      Yes
             ↓       ↓
         Redirect   Render
       to /unauthorized  <User />
```

## Examples

### Example 1: Admin-Only Route

```tsx
<Route
  path="users"
  element={
    <ProtectedRoute allowedRoles={['Admin']}>
      <User />
    </ProtectedRoute>
  }
/>
```

- Only users with role "Admin" can access
- Lecturers will be redirected to unauthorized page
- Unauthenticated users redirected to login

### Example 2: Multiple Roles

```tsx
<Route
  path="courses"
  element={
    <ProtectedRoute allowedRoles={['Admin', 'Lecturer']}>
      <Courses />
    </ProtectedRoute>
  }
/>
```

- Both Admin and Lecturer can access
- Other roles will be redirected to unauthorized page

### Example 3: Any Authenticated User

```tsx
<Route path="settings/profile" element={<Profile />} />
```

- No `ProtectedRoute` wrapper needed
- Route is under authenticated `/edutrack` parent route
- All authenticated users can access

## Security Considerations

### Frontend Protection (Current Implementation)

✅ **Prevents accidental access** via URL navigation
✅ **Improves UX** with proper error messages
✅ **Hides UI elements** (menus) based on permissions

### Backend Protection (Critical!)

⚠️ **IMPORTANT**: Frontend protection is NOT sufficient for security!

**You MUST also implement backend protection:**

```php
// Example Laravel backend protection
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/api/users', [UserController::class, 'index']);
    Route::post('/api/users', [UserController::class, 'store']);
    Route::delete('/api/users/{id}', [UserController::class, 'destroy']);
});
```

### Why Both Frontend and Backend?

- **Frontend**: Better UX, prevents mistakes
- **Backend**: Real security, prevents malicious access
- Frontend can be bypassed with browser tools
- Backend protection is the real security layer

## Testing

### Test Case 1: Admin User
1. Login as Admin
2. Navigate to `/edutrack/users`
3. ✅ Should see User Management page

### Test Case 2: Lecturer User
1. Login as Lecturer
2. Navigate to `/edutrack/users` (by typing in URL)
3. ✅ Should be redirected to unauthorized page
4. ✅ Should see "Access Denied" message

### Test Case 3: Unauthenticated User
1. Logout
2. Navigate to `/edutrack/users`
3. ✅ Should be redirected to login page

## Adding New Protected Routes

1. Create your component
2. Add route in [src/App.tsx](src/App.tsx)
3. Wrap with `ProtectedRoute` if role-specific access needed

```tsx
import NewComponent from './pages/NewComponent';

// In Routes
<Route
  path="new-feature"
  element={
    <ProtectedRoute allowedRoles={['Admin', 'Lecturer']}>
      <NewComponent />
    </ProtectedRoute>
  }
/>
```

## Troubleshooting

### Issue: Still can access restricted route
- Check if user role matches exactly (case-insensitive)
- Verify AuthContext has correct user data
- Check browser console for navigation logs

### Issue: Redirecting to login when authenticated
- Check token expiration
- Verify localStorage has token
- Check `isAuthenticated` state in AuthContext

### Issue: Always showing unauthorized
- Verify `allowedRoles` array spelling
- Check user.role value from API
- Ensure role comparison is working correctly

## Future Enhancements

- [ ] Add permission-based access (in addition to roles)
- [ ] Add route-level loading states
- [ ] Add audit logging for access attempts
- [ ] Add role hierarchy (Admin > Lecturer > Student)
- [ ] Cache role permissions for performance
