# SnackBarLib Action-Based Usage Guide

The SnackBarLib now supports action-based messages, similar to Angular's ViewChild pattern, making it easier to show consistent success/error messages for common operations.

## Action Types

The component supports predefined actions:
- `save` - For create/register operations
- `update` - For update/edit operations
- `delete` - For delete operations
- `custom` - For custom messages (requires `description` prop)

## Quick Usage

### 1. Save Success/Failed

```tsx
// Success
setNotification({
  show: true,
  type: "success",
  action: "save",
  entityName: "User"
});
// Output: "User saved successfully!"

// Failed
setNotification({
  show: true,
  type: "error",
  action: "save",
  entityName: "User"
});
// Output: "Failed to save user. Please try again."
```

### 2. Update Success/Failed

```tsx
// Success
setNotification({
  show: true,
  type: "success",
  action: "update",
  entityName: "Student"
});
// Output: "Student updated successfully!"

// Failed
setNotification({
  show: true,
  type: "error",
  action: "update",
  entityName: "Student"
});
// Output: "Failed to update student. Please try again."
```

### 3. Delete Success/Failed

```tsx
// Success
setNotification({
  show: true,
  type: "success",
  action: "delete",
  entityName: "John Doe"
});
// Output: "John Doe deleted successfully!"

// Failed
setNotification({
  show: true,
  type: "error",
  action: "delete",
  entityName: "John Doe"
});
// Output: "Failed to delete john doe. Please try again."
```

### 4. Custom Messages

```tsx
setNotification({
  show: true,
  type: "warning",
  action: "custom",
  message: "Please fill in all required fields correctly"
});
// Output: "Please fill in all required fields correctly"
```

## Complete Example - User Form

```tsx
import { useState } from "react";
import SnackBarLib, { type SnackBarType } from "../../components/SnackBarLib/SnackBarLib";
import { register } from "./UserService";

export default function UserForm() {
  const [notification, setNotification] = useState<{
    show: boolean;
    type: SnackBarType;
    action?: 'save' | 'update' | 'delete' | 'custom';
    entityName?: string;
    message?: string;
  }>({
    show: false,
    type: "success",
  });

  const onSave = () => {
    register(formData)
      .then((data) => {
        if (data.message === "Register Successfully") {
          // ✅ Show save success
          setNotification({
            show: true,
            type: "success",
            action: "save",
            entityName: "User",
          });
        } else {
          // ❌ Show save failed
          setNotification({
            show: true,
            type: "error",
            action: "save",
            entityName: "User",
          });
        }
      })
      .catch((error) => {
        // ❌ Show save failed
        setNotification({
          show: true,
          type: "error",
          action: "save",
          entityName: "User",
        });
      });
  };

  return (
    <>
      {/* Your form components */}

      <SnackBarLib
        type={notification.type}
        action={notification.action}
        entityName={notification.entityName}
        description={notification.message}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </>
  );
}
```

## Complete Example - User Table (Delete)

```tsx
import { useState } from "react";
import SnackBarLib, { type SnackBarType } from "../../components/SnackBarLib/SnackBarLib";
import { deleteUser } from "./UserService";

export default function UserTable() {
  const [notification, setNotification] = useState<{
    show: boolean;
    type: SnackBarType;
    action?: 'save' | 'update' | 'delete' | 'custom';
    entityName?: string;
    message?: string;
  }>({
    show: false,
    type: "success",
  });

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id);

      // ✅ Show delete success
      setNotification({
        show: true,
        type: "success",
        action: "delete",
        entityName: user.name,
      });

      // Refresh table...
    } catch (error) {
      // ❌ Show delete failed
      setNotification({
        show: true,
        type: "error",
        action: "delete",
        entityName: user.name,
      });
    }
  };

  return (
    <>
      {/* Your table components */}

      <SnackBarLib
        type={notification.type}
        action={notification.action}
        entityName={notification.entityName}
        description={notification.message}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </>
  );
}
```

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `SnackBarType` | ✅ | Type of notification: 'success', 'error', 'warning', 'info' |
| `action` | `'save' \| 'update' \| 'delete' \| 'custom'` | ❌ | Predefined action type |
| `entityName` | `string` | ❌ | Name of entity being acted upon (e.g., "User", "John Doe") |
| `description` | `string` | ❌ | Custom message (required when `action='custom'`) |
| `show` | `boolean` | ❌ | Whether to show notification (default: true) |
| `onClose` | `() => void` | ❌ | Callback when notification is closed |
| `autoHideDuration` | `number` | ❌ | Auto-hide duration in ms (default: 5000) |
| `position` | `SnackBarPosition` | ❌ | Position on screen (default: 'top-right') |

## Message Templates

### Save Action
- **Success**: `"{entityName} saved successfully!"`
- **Error**: `"Failed to save {entityName.toLowerCase()}. Please try again."`

### Update Action
- **Success**: `"{entityName} updated successfully!"`
- **Error**: `"Failed to update {entityName.toLowerCase()}. Please try again."`

### Delete Action
- **Success**: `"{entityName} deleted successfully!"`
- **Error**: `"Failed to delete {entityName.toLowerCase()}. Please try again."`

### Custom Action
- Uses the provided `description` prop

## Default Entity Name

If `entityName` is not provided, it defaults to `"Data"`:

```tsx
setNotification({
  show: true,
  type: "success",
  action: "save",
  // No entityName provided
});
// Output: "Data saved successfully!"
```

## Best Practices

1. **Use specific entity names** for better user experience:
   ```tsx
   entityName: "User"        // ✅ Good
   entityName: user.name     // ✅ Better (for delete)
   entityName: "Data"        // ❌ Not specific
   ```

2. **Use action types for common operations**:
   ```tsx
   action: "save"    // ✅ Use predefined action
   action: "custom"  // ❌ Only when message doesn't fit standard patterns
   ```

3. **Keep notification state consistent**:
   ```tsx
   const [notification, setNotification] = useState<{
     show: boolean;
     type: SnackBarType;
     action?: 'save' | 'update' | 'delete' | 'custom';
     entityName?: string;
     message?: string;
   }>({
     show: false,
     type: "success",
   });
   ```

4. **Always handle both success and error cases**:
   ```tsx
   try {
     await saveData();
     setNotification({ show: true, type: "success", action: "save", entityName: "User" });
   } catch (error) {
     setNotification({ show: true, type: "error", action: "save", entityName: "User" });
   }
   ```

## Migration from Old Pattern

### Before (Manual Messages)
```tsx
setNotification({
  show: true,
  type: "success",
  message: "User saved successfully!",
});
```

### After (Action-Based)
```tsx
setNotification({
  show: true,
  type: "success",
  action: "save",
  entityName: "User",
});
```

## Comparison with Angular ViewChild Pattern

### Angular (ViewChild)
```typescript
@ViewChild('dialog') dialog: MyDialogComponent;

// Usage
this.dialog.saveSuccess();
this.dialog.saveFailed(error);
```

### React (Action-Based State)
```tsx
const [notification, setNotification] = useState<NotificationState>({...});

// Usage
setNotification({ show: true, type: "success", action: "save", entityName: "User" });
setNotification({ show: true, type: "error", action: "save", entityName: "User" });
```

The React pattern achieves similar convenience while being more declarative and following React's data flow principles.
