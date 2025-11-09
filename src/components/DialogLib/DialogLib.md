# DialogLib Component

A reusable dialog component built with Material-UI's Dialog, featuring customizable content, actions, and styling for confirmation dialogs and custom dialogs.

## Features

- **Material-UI Integration**: Built on top of Material-UI's Dialog component
- **Pre-built Dialog Types**: Ready-to-use save confirmation dialogs
- **Custom Dialog Support**: Flexible content and title customization
- **Button Integration**: Uses ButtonLib for consistent button styling
- **Customizable Dimensions**: Configurable width and height
- **Auto-close Functionality**: Smart handling of cancel/close actions
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `DialogType` | ✅ | - | Type of dialog ('saveConfirmation' \| 'custom') |
| `open` | `boolean` | ✅ | - | Controls dialog visibility |
| `onClose` | `() => void` | ✅ | - | Callback when dialog should close |
| `onButtonClick` | `(buttonType: ButtonType) => void` | ✅ | - | Callback for button clicks (except cancel) |
| `title` | `string` | ❌ | - | Custom title for 'custom' type dialogs |
| `content` | `string` | ❌ | - | Custom content for 'custom' type dialogs |
| `width` | `string` | ❌ | `'350px'` | Dialog width in CSS units |
| `height` | `string` | ❌ | `'150px'` | Dialog height in CSS units |

## Types and Interfaces

### DialogType

```typescript
type DialogType = 'saveConfirmation' | 'custom';
```

### DialogLibProps

```typescript
interface DialogLibProps {
  type: DialogType;
  open: boolean;
  onClose: () => void;
  onButtonClick: (buttonType: ButtonType) => void;
  title?: string;
  content?: string;
  width?: string;
  height?: string;
}
```

### ButtonType (from ButtonLib)

```typescript
type ButtonType = 'add' | 'reset' | 'save' | 'back' | 'confirm' | 'cancel';
```

## Usage Examples

### Save Confirmation Dialog

```tsx
import DialogLib from '../components/DialogLib/DialogLib';
import type { ButtonType } from '../components/ButtonLib/ButtonLib';

function MyComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    // Perform save action
    console.log('Saving data...');
    setIsDialogOpen(false);
  };

  const handleDialogAction = (buttonType: ButtonType) => {
    if (buttonType === 'confirm') {
      handleSave();
    }
  };

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)}>
        Save Changes
      </button>

      <DialogLib
        type="saveConfirmation"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onButtonClick={handleDialogAction}
      />
    </>
  );
}
```

### Custom Dialog

```tsx
<DialogLib
  type="custom"
  open={isCustomDialogOpen}
  onClose={() => setIsCustomDialogOpen(false)}
  onButtonClick={handleCustomAction}
  title="Delete Confirmation"
  content="Are you sure you want to delete this item? This action cannot be undone."
  width="400px"
  height="200px"
/>
```

### Form Integration Example

```tsx
function UserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    idno: "",
    role: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSave = () => {
    console.log("Form data to be saved:", form);
    // Perform actual save operation
    setIsDialogOpen(false);
  };

  const onClickButton = (e: ButtonType) => {
    if (e === "save") {
      setIsDialogOpen(true);
    }
  };

  const handleDialogAction = (buttonType: ButtonType) => {
    if (buttonType === "confirm") {
      onSave();
    }
  };

  return (
    <>
      {/* Form fields */}
      <ActionButtonGroup>
        <ButtonLib type="save" onClick={onClickButton} />
      </ActionButtonGroup>

      <DialogLib
        type="saveConfirmation"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onButtonClick={handleDialogAction}
      />
    </>
  );
}
```

### Custom Dimensions

```tsx
<DialogLib
  type="saveConfirmation"
  open={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  onButtonClick={handleDialogAction}
  width="500px"
  height="250px"
/>
```

## Dialog Types

### Save Confirmation (`type="saveConfirmation"`)

**Default Content:**
- **Title**: "Save Confirmation"
- **Content**: "Are you sure you want to save?"
- **Buttons**: Cancel (red) + Confirm (green)

**Behavior:**
- Cancel button automatically closes dialog without calling `onButtonClick`
- Confirm button calls `onButtonClick` with `'confirm'` parameter
- Parent component handles the actual save logic

### Custom (`type="custom"`)

**Features:**
- Custom title and content via props
- Single Cancel button by default
- Flexible content for any use case

**Usage:**
- Requires `title` and `content` props
- Useful for delete confirmations, warnings, or information dialogs

## Button Integration

The DialogLib uses the ButtonLib component for consistent styling:

### Button Types Used
- **Cancel**: `type="cancel"` - Red styling (`danger` class)
- **Confirm**: `type="confirm"` - Green styling (`success` class)

### Button Behavior
- **Cancel/Back**: Automatically closes dialog, doesn't trigger `onButtonClick`
- **Confirm**: Triggers `onButtonClick` callback, parent handles closing

## Styling and Theming

### CSS Classes

```css
.dialog-lib .dialog-title {
  padding: 16px 24px 8px 24px;
  font-weight: 600;
  color: white;
}

.dialog-lib .dialog-content {
  padding: 0px inherit 16px 24px;
  color: white;
}

.dialog-lib .dialog-actions {
  padding: 8px 16px 16px 16px;
  gap: 8px;
}

.dialog-lib .MuiDialog-paper {
  border-radius: 8px;
  background-color: #2a2838;
}
```

### Default Styling
- **Background**: Dark theme (`#2a2838`)
- **Text**: White color for title and content
- **Border Radius**: 8px rounded corners
- **Button Gap**: 8px spacing between buttons

### Customization
- Override CSS classes for custom styling
- Use `width` and `height` props for dimensions
- Button styles inherited from ButtonLib component

## Event Handling

### onClose Callback
- Triggered when user clicks outside dialog or presses Escape
- Triggered when Cancel button is clicked
- Should update the `open` state to `false`

### onButtonClick Callback
- Only called for action buttons (Confirm, etc.)
- Not called for Cancel button (auto-closes)
- Receives `ButtonType` parameter indicating which button was clicked

```typescript
const handleDialogAction = (buttonType: ButtonType) => {
  switch (buttonType) {
    case 'confirm':
      // Handle confirmation
      break;
    // Add other button types as needed
  }
};
```

## Best Practices

### State Management
```tsx
// Good: Simple boolean state for dialog visibility
const [isDialogOpen, setIsDialogOpen] = useState(false);

// Good: Separate handlers for different actions
const handleDialogAction = (buttonType: ButtonType) => {
  if (buttonType === 'confirm') {
    performAction();
  }
};
```

### Error Handling
```tsx
const handleSave = async () => {
  try {
    await saveData(form);
    setIsDialogOpen(false);
    // Show success message
  } catch (error) {
    // Keep dialog open, show error
    console.error('Save failed:', error);
  }
};
```

### Accessibility
- Dialog automatically manages focus
- Escape key closes dialog
- Click outside closes dialog
- ARIA attributes handled by Material-UI

## Dependencies

- `@mui/material` - Material-UI Dialog components
- `../ButtonLib/ButtonLib` - Custom button component
- React 16.8+ (for hooks support)
- TypeScript (for type definitions)

## Component Architecture

### State Management
- Parent component controls `open` state
- Dialog manages internal button interactions
- Clean separation of concerns between UI and business logic

### Event Flow
1. User triggers action (e.g., clicks Save)
2. Parent sets `open={true}`
3. User interacts with dialog buttons
4. Cancel → Auto-close via `onClose`
5. Confirm → Callback to parent via `onButtonClick`
6. Parent handles business logic and closes dialog

### Integration Pattern
```tsx
// 1. State for dialog visibility
const [isDialogOpen, setIsDialogOpen] = useState(false);

// 2. Trigger function
const triggerDialog = () => setIsDialogOpen(true);

// 3. Action handler
const handleAction = (buttonType: ButtonType) => {
  // Business logic here
  setIsDialogOpen(false); // Close after action
};

// 4. Render dialog
<DialogLib
  type="saveConfirmation"
  open={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  onButtonClick={handleAction}
/>
```

## Troubleshooting

### Dialog not appearing
- Check that `open={true}` is set
- Verify Material-UI theme is properly configured
- Ensure component is rendered in the DOM

### Buttons not working
- Verify `onButtonClick` callback is properly defined
- Check that ButtonLib component is properly imported
- Ensure button types match expected values

### Styling issues
- Check CSS class specificity
- Verify Material-UI theme configuration
- Ensure custom CSS doesn't conflict with component styles

### Auto-close not working
- Verify `onClose` callback updates the `open` state
- Check that Cancel button uses the correct button type
- Ensure event handlers are properly bound

### Custom content not showing
- For `type="custom"`, ensure `title` and `content` props are provided
- Check that props are being passed correctly
- Verify string values are not empty

### Dimension issues
- Use valid CSS units for `width` and `height` props
- Consider responsive design for different screen sizes
- Test with various content lengths