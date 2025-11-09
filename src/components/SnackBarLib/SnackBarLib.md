# SnackBarLib Component

A reusable notification component built with Material-UI's Alert and Slide components, featuring customizable positioning, auto-hide functionality, and themed styling for different message types.

## Features

- **Material-UI Integration**: Built on top of Material-UI's Alert and Slide components
- **Multiple Message Types**: Support for success, warning, error, and info notifications
- **Flexible Positioning**: Six different position options for optimal placement
- **Auto-hide Functionality**: Configurable auto-hide duration with manual override
- **Smooth Animations**: Slide-in animation for better user experience
- **Custom Styling**: Theme-aware styling with color-coded message types
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `'success' \| 'warning' \| 'error' \| 'info'` | ✅ | - | Type of notification determining color and icon |
| `description` | `string` | ✅ | - | Message content to display |
| `show` | `boolean` | ❌ | `true` | Whether to show the notification |
| `onClose` | `() => void` | ❌ | - | Callback when notification is closed |
| `autoHideDuration` | `number` | ❌ | `5000` | Auto-hide duration in milliseconds (0 to disable) |
| `position` | `PositionType` | ❌ | `'top-right'` | Position of the notification on screen |

## Types and Interfaces

### SnackBarLibProps

```typescript
interface SnackBarLibProps {
  type: 'success' | 'warning' | 'error' | 'info';
  description: string;
  show?: boolean;
  onClose?: () => void;
  autoHideDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
```

### Position Types

```typescript
type PositionType =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';
```

## Usage Examples

### Basic Usage

```tsx
import SnackBarLib from '../components/SnackBarLib/SnackBarLib';

function MyComponent() {
  const [showNotification, setShowNotification] = useState(false);

  const handleShowSuccess = () => {
    setShowNotification(true);
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  return (
    <div>
      <button onClick={handleShowSuccess}>
        Show Success Message
      </button>

      <SnackBarLib
        type="success"
        description="Operation completed successfully!"
        show={showNotification}
        onClose={handleClose}
      />
    </div>
  );
}
```

### Different Message Types

```tsx
function NotificationExamples() {
  const [notifications, setNotifications] = useState({
    success: false,
    warning: false,
    error: false,
    info: false
  });

  const showNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: true }));
  };

  const hideNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div>
      <button onClick={() => showNotification('success')}>
        Show Success
      </button>
      <button onClick={() => showNotification('warning')}>
        Show Warning
      </button>
      <button onClick={() => showNotification('error')}>
        Show Error
      </button>
      <button onClick={() => showNotification('info')}>
        Show Info
      </button>

      <SnackBarLib
        type="success"
        description="Data saved successfully!"
        show={notifications.success}
        onClose={() => hideNotification('success')}
      />

      <SnackBarLib
        type="warning"
        description="Please review your input before proceeding."
        show={notifications.warning}
        onClose={() => hideNotification('warning')}
      />

      <SnackBarLib
        type="error"
        description="Failed to save data. Please try again."
        show={notifications.error}
        onClose={() => hideNotification('error')}
      />

      <SnackBarLib
        type="info"
        description="New updates are available for download."
        show={notifications.info}
        onClose={() => hideNotification('info')}
      />
    </div>
  );
}
```

### Different Positions

```tsx
function PositionExamples() {
  const [activePosition, setActivePosition] = useState<string | null>(null);

  const positions = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center'
  ] as const;

  const showAtPosition = (position: typeof positions[number]) => {
    setActivePosition(position);
  };

  return (
    <div>
      {positions.map(position => (
        <button
          key={position}
          onClick={() => showAtPosition(position)}
        >
          Show at {position}
        </button>
      ))}

      {positions.map(position => (
        <SnackBarLib
          key={position}
          type="info"
          description={`Notification at ${position}`}
          show={activePosition === position}
          position={position}
          onClose={() => setActivePosition(null)}
        />
      ))}
    </div>
  );
}
```

### Custom Auto-hide Duration

```tsx
function CustomDurationExample() {
  const [showPersistent, setShowPersistent] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPersistent(true)}>
        Show Persistent (No Auto-hide)
      </button>
      <button onClick={() => setShowQuick(true)}>
        Show Quick (2 seconds)
      </button>

      {/* Persistent notification - no auto-hide */}
      <SnackBarLib
        type="warning"
        description="This notification won't auto-hide. Click X to close."
        show={showPersistent}
        autoHideDuration={0}
        onClose={() => setShowPersistent(false)}
      />

      {/* Quick notification - 2 seconds */}
      <SnackBarLib
        type="success"
        description="This will disappear in 2 seconds!"
        show={showQuick}
        autoHideDuration={2000}
        onClose={() => setShowQuick(false)}
      />
    </div>
  );
}
```

### With Global Notification System

```tsx
// Context for global notifications
const NotificationContext = createContext<{
  showNotification: (type: string, message: string) => void;
}>({
  showNotification: () => {}
});

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    show: boolean;
  } | null>(null);

  const showNotification = (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
  };

  const hideNotification = () => {
    setNotification(prev => prev ? { ...prev, show: false } : null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <SnackBarLib
          type={notification.type}
          description={notification.message}
          show={notification.show}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

// Usage in components
function MyForm() {
  const { showNotification } = useContext(NotificationContext);

  const handleSubmit = async () => {
    try {
      await api.saveData();
      showNotification('success', 'Data saved successfully!');
    } catch (error) {
      showNotification('error', 'Failed to save data.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
}
```

### Queue Multiple Notifications

```tsx
function NotificationQueue() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    show: boolean;
  }>>([]);

  const addNotification = (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, show: true }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, show: false } : notif
      )
    );

    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  };

  return (
    <div>
      <button onClick={() => addNotification('success', 'Success message')}>
        Add Success
      </button>
      <button onClick={() => addNotification('error', 'Error message')}>
        Add Error
      </button>

      {notifications.map((notification, index) => (
        <SnackBarLib
          key={notification.id}
          type={notification.type}
          description={notification.message}
          show={notification.show}
          position="top-right"
          onClose={() => removeNotification(notification.id)}
          autoHideDuration={3000 + (index * 500)} // Stagger auto-hide
        />
      ))}
    </div>
  );
}
```

## Message Types and Styling

### Success Type
- **Color**: `#4caf50` (Green)
- **Background**: `#e8f5e8` (Light Green)
- **Use for**: Successful operations, confirmations, completed actions

### Warning Type
- **Color**: `#ff9800` (Orange)
- **Background**: `#fff3e0` (Light Orange)
- **Use for**: Cautions, important information, potential issues

### Error Type
- **Color**: `#f44336` (Red)
- **Background**: `#ffebee` (Light Red)
- **Use for**: Errors, failures, critical issues

### Info Type
- **Color**: `#2196f3` (Blue)
- **Background**: `#e3f2fd` (Light Blue)
- **Use for**: General information, tips, updates

## Positioning Options

### Available Positions

| Position | Description | Use Case |
|----------|-------------|----------|
| `top-right` | Top right corner | Default, non-intrusive |
| `top-left` | Top left corner | Alternative to top-right |
| `bottom-right` | Bottom right corner | Less prominent placement |
| `bottom-left` | Bottom left corner | Alternative to bottom-right |
| `top-center` | Top center | Important messages |
| `bottom-center` | Bottom center | Form validation messages |

### Position Styling
- **Fixed positioning** with high z-index (9999)
- **Min width**: 300px, **Max width**: 400px
- **20px offset** from screen edges
- **Center positions** use transform for proper centering

## Animation and Behavior

### Slide Animation
- Uses Material-UI's Slide component
- **Direction**: Left (slides in from right)
- **Mount/Unmount**: Proper mounting and unmounting for performance

### Auto-hide Functionality
- **Default duration**: 5000ms (5 seconds)
- **Disable auto-hide**: Set `autoHideDuration={0}`
- **Custom duration**: Any positive number in milliseconds
- **Timer cleanup**: Automatic cleanup on component unmount

## Dependencies

- `@mui/material` - Material-UI components (Alert, Box, Slide)
- React 16.8+ (for hooks support)
- TypeScript (for type definitions)

## Component Architecture

### State Management
- External state control through `show` prop
- Auto-hide timer management with useEffect
- Proper cleanup and memory management

### Event Handling
- `onClose`: Called when notification is dismissed
- Auto-hide timer with configurable duration
- Manual close via close button

### Styling System
- Theme-based color configuration
- Position-based absolute positioning
- Material-UI Alert component styling
- Custom shadow and border styling

## Best Practices

### Usage Guidelines
- Use appropriate message types for different scenarios
- Keep messages concise and actionable
- Provide manual close option for important messages
- Consider auto-hide duration based on message importance

### Performance Considerations
- Unmount notifications when not shown
- Clean up timers properly
- Avoid showing too many notifications simultaneously
- Use notification queues for multiple messages

### Accessibility
- Provide meaningful message content
- Ensure proper color contrast
- Support keyboard navigation for close action
- Use semantic HTML through Material-UI components

## Troubleshooting

### Notification not showing
- Check that `show` prop is set to `true`
- Verify component is properly rendered in DOM
- Check for z-index conflicts with other elements

### Auto-hide not working
- Ensure `autoHideDuration` is greater than 0
- Verify `onClose` callback is properly implemented
- Check for timer conflicts or component unmounting

### Position issues
- Verify position prop is one of the supported values
- Check for CSS conflicts affecting positioning
- Ensure parent containers don't override fixed positioning

### Styling problems
- Check Material-UI theme configuration
- Verify custom styles don't conflict with component styles
- Ensure proper CSS import order

### Multiple notifications overlapping
- Implement notification queue system
- Use different positions for simultaneous notifications
- Add staggered timing for auto-hide
- Consider using a notification container

### Performance issues with many notifications
- Implement proper cleanup in useEffect
- Use React.memo if needed for optimization
- Limit number of simultaneous notifications
- Consider virtualization for notification lists