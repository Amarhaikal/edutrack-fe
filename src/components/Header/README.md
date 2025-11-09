# Header Component

A header component with user information and logout functionality, designed to work with the dark theme.

## Features

- Clean header design with dark theme
- User information display with icon
- Logout button with confirmation
- Responsive design for mobile devices
- Automatic navigation to login page on logout

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `userName` | `string` | Display name of the current user | `"User"` |

## Usage

```tsx
import Header from './components/Header';

function App() {
  return (
    <Header userName="John Doe" />
  );
}
```

## Functionality

### Logout Process
1. **API Call**: Makes authenticated logout request to backend
2. **Token Removal**: Removes authentication token from localStorage
3. **Navigation**: Redirects user to the login page (`/login`)
4. **Error Handling**: Falls back to local logout if API fails
5. **Loading State**: Shows loading indicator during logout process

### User Display
- Shows user icon and name
- Responsive design that adapts to screen size
- Consistent styling with the overall dark theme

## Styling

The component uses CSS classes for styling and includes:
- Dark theme colors matching the sidebar
- Hover effects on interactive elements
- Responsive breakpoints for mobile devices
- Smooth transitions and animations

## Dependencies

- `react-router-dom` - For navigation functionality
- `lucide-react` - For icons (LogOut, User)

## Responsive Behavior

- **Desktop**: Full header with title, user info, and logout button
- **Tablet**: Compact layout with hidden logout text
- **Mobile**: Stacked layout for better mobile experience
