# ButtonLib Component

A reusable button component built with Material-UI's Button, featuring predefined button types with consistent styling, icons, and semantic meaning for common actions.

## Features

- **Material-UI Integration**: Built on top of Material-UI's Button component
- **Predefined Button Types**: Six common button types with semantic styling
- **Icon Integration**: Built-in Lucide React icons for specific button types
- **Consistent Styling**: Uniform appearance with custom CSS classes
- **Type-safe Callbacks**: TypeScript-enforced button type in click handlers
- **Compact Design**: Optimized for small form factors with 11px font size

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `ButtonType` | ✅ | - | The button type determining appearance and behavior |
| `onClick` | `(type: ButtonType) => void` | ✅ | - | Callback function when button is clicked |

## Types and Interfaces

### ButtonType

```typescript
type ButtonType = 'add' | 'reset' | 'save' | 'back' | 'confirm' | 'cancel';
```

### ButtonLibProps

```typescript
interface ButtonLibProps {
  type: ButtonType;                      // Button type
  onClick: (type: ButtonType) => void;   // Click handler with type
}
```

## Button Types and Styling

### Add Button (`type="add"`)
- **Style**: Primary blue (`rgb(67, 78, 233)`)
- **Icon**: Plus icon
- **Text**: "Add"
- **Use for**: Creating new items, adding elements

### Reset Button (`type="reset"`)
- **Style**: Danger red (`rgb(220, 53, 69)`)
- **Icon**: RotateCcw (counter-clockwise rotation)
- **Text**: "Reset"
- **Use for**: Clearing forms, resetting state

### Save Button (`type="save"`)
- **Style**: Success green (`rgb(40, 167, 69)`)
- **Icon**: None
- **Text**: "Save"
- **Use for**: Saving data, confirming changes

### Back Button (`type="back"`)
- **Style**: Secondary gray (`rgb(54, 54, 54)`)
- **Icon**: None
- **Text**: "Back"
- **Use for**: Navigation, returning to previous page

### Confirm Button (`type="confirm"`)
- **Style**: Success green (`rgb(40, 167, 69)`)
- **Icon**: None
- **Text**: "Confirm"
- **Use for**: Confirming actions, dialog confirmations

### Cancel Button (`type="cancel"`)
- **Style**: Danger red (`rgb(220, 53, 69)`)
- **Icon**: None
- **Text**: "Cancel"
- **Use for**: Canceling actions, closing dialogs

## Usage Examples

### Basic Usage

```tsx
import ButtonLib, { type ButtonType } from '../components/ButtonLib/ButtonLib';

function MyComponent() {
  const handleButtonClick = (type: ButtonType) => {
    console.log('Button clicked:', type);
  };

  return (
    <div>
      <ButtonLib type="add" onClick={handleButtonClick} />
      <ButtonLib type="save" onClick={handleButtonClick} />
      <ButtonLib type="cancel" onClick={handleButtonClick} />
    </div>
  );
}
```

### Form Actions

```tsx
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleButtonAction = (type: ButtonType) => {
    switch (type) {
      case 'save':
        console.log('Saving form data:', formData);
        // Save logic here
        break;
      case 'reset':
        setFormData({ name: '', email: '' });
        console.log('Form reset');
        break;
      case 'cancel':
        // Navigate away or close form
        console.log('Form cancelled');
        break;
    }
  };

  return (
    <form>
      {/* Form fields */}
      <div className="form-actions">
        <ButtonLib type="save" onClick={handleButtonAction} />
        <ButtonLib type="reset" onClick={handleButtonAction} />
        <ButtonLib type="cancel" onClick={handleButtonAction} />
      </div>
    </form>
  );
}
```

### Navigation with Back Button

```tsx
import { useNavigate } from 'react-router-dom';

function DetailPage() {
  const navigate = useNavigate();

  const handleButtonClick = (type: ButtonType) => {
    if (type === 'back') {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Page Details</h1>
        <ButtonLib type="back" onClick={handleButtonClick} />
      </div>
      {/* Page content */}
    </div>
  );
}
```

### Dialog Actions

```tsx
function ConfirmationDialog({ open, onClose, onConfirm }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const handleDialogAction = (type: ButtonType) => {
    if (type === 'confirm') {
      onConfirm();
    } else if (type === 'cancel') {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this item?
      </DialogContent>
      <DialogActions>
        <ButtonLib type="cancel" onClick={handleDialogAction} />
        <ButtonLib type="confirm" onClick={handleDialogAction} />
      </DialogActions>
    </Dialog>
  );
}
```

### List Management

```tsx
function ItemList() {
  const [items, setItems] = useState<string[]>([]);

  const handleListAction = (type: ButtonType) => {
    switch (type) {
      case 'add':
        const newItem = `Item ${items.length + 1}`;
        setItems(prev => [...prev, newItem]);
        break;
      case 'reset':
        setItems([]);
        break;
    }
  };

  return (
    <div>
      <div className="list-header">
        <h2>Items ({items.length})</h2>
        <ButtonLib type="add" onClick={handleListAction} />
        <ButtonLib type="reset" onClick={handleListAction} />
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

### With ActionButtonGroup

```tsx
import ActionButtonGroup from '../components/ActionButtonGroup/ActionButtonGroup';

function FormWithActions() {
  const [formState, setFormState] = useState('editing');

  const handleFormAction = (type: ButtonType) => {
    switch (type) {
      case 'save':
        console.log('Saving...');
        setFormState('saved');
        break;
      case 'cancel':
        console.log('Cancelled');
        setFormState('cancelled');
        break;
      case 'reset':
        console.log('Reset form');
        // Reset form logic
        break;
    }
  };

  return (
    <div>
      {/* Form content */}

      <ActionButtonGroup>
        <ButtonLib type="save" onClick={handleFormAction} />
        <ButtonLib type="reset" onClick={handleFormAction} />
        <ButtonLib type="cancel" onClick={handleFormAction} />
      </ActionButtonGroup>
    </div>
  );
}
```

### Conditional Button Rendering

```tsx
function ConditionalButtons() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [hasChanges, setHasChanges] = useState(false);

  const handleButtonAction = (type: ButtonType) => {
    switch (type) {
      case 'save':
        console.log('Saving changes...');
        setHasChanges(false);
        setMode('view');
        break;
      case 'cancel':
        setMode('view');
        setHasChanges(false);
        break;
      case 'reset':
        // Reset to original values
        setHasChanges(false);
        break;
    }
  };

  return (
    <div>
      {/* Content */}

      <div className="button-group">
        {mode === 'edit' && (
          <>
            <ButtonLib type="save" onClick={handleButtonAction} />
            {hasChanges && (
              <ButtonLib type="reset" onClick={handleButtonAction} />
            )}
            <ButtonLib type="cancel" onClick={handleButtonAction} />
          </>
        )}
      </div>
    </div>
  );
}
```

## Styling Details

### CSS Classes

| Class Name | Background Color | Text Color | Usage |
|------------|------------------|------------|-------|
| `.primary` | `rgb(67, 78, 233)` (Blue) | White | Add actions |
| `.danger` | `rgb(220, 53, 69)` (Red) | White | Destructive actions |
| `.secondary` | `rgb(54, 54, 54)` (Dark Gray) | White | Secondary actions |
| `.success` | `rgb(40, 167, 69)` (Green) | White | Positive actions |

### Common Styling Properties
- **Font size**: 11px
- **Text transform**: Capitalize
- **Minimum width**: 70px
- **Size**: Small (Material-UI small variant)
- **Variant**: Contained (Material-UI contained variant)

### Icon Details
- **Add button**: Plus icon (14px size)
- **Reset button**: RotateCcw icon (14px size)
- **Other buttons**: No icons

## Button Type Guidelines

### When to Use Each Type

| Button Type | Recommended Usage | Context |
|-------------|-------------------|---------|
| `add` | Creating new items | Lists, forms, collections |
| `reset` | Clearing/resetting data | Forms, filters, settings |
| `save` | Persisting changes | Forms, editors, configurations |
| `back` | Navigation backwards | Detail pages, multi-step flows |
| `confirm` | Confirming actions | Dialogs, dangerous operations |
| `cancel` | Canceling operations | Dialogs, forms, processes |

### Color Psychology
- **Blue (Primary)**: Trust, reliability, action-oriented
- **Green (Success)**: Positive, safe, completion
- **Red (Danger)**: Caution, destructive, attention-grabbing
- **Gray (Secondary)**: Neutral, less prominent

## Dependencies

- `@mui/material` - Material-UI Button component
- `lucide-react` - Icon components (Plus, RotateCcw)
- React 16.8+ (for hooks support if needed)
- TypeScript (for type definitions)

## Component Architecture

### Design Pattern
- **Controlled rendering**: Each button type has specific rendering logic
- **Type-safe callbacks**: Button type is passed to click handler
- **Icon integration**: Icons are conditionally rendered based on type
- **CSS class mapping**: Each type maps to specific CSS class

### Styling Strategy
- **CSS-in-JS alternative**: Uses CSS classes with Material-UI
- **Override approach**: Uses `!important` to ensure consistent styling
- **Small form factor**: Optimized for compact UIs

### Event Handling
- **Single callback pattern**: One `onClick` handler for all types
- **Type identification**: Button type passed as parameter
- **Switch-case friendly**: Designed for switch statement handling

## Best Practices

### Usage Guidelines
- Use semantically appropriate button types
- Group related buttons using ActionButtonGroup
- Maintain consistent spacing between buttons
- Consider button placement based on user flow

### Performance Considerations
- Buttons are lightweight with minimal rendering overhead
- Icons are imported statically for better tree-shaking
- CSS classes are applied efficiently

### Accessibility
- Material-UI Button provides built-in accessibility features
- Icons include proper sizing for visual clarity
- Color contrast meets accessibility standards
- Text labels are descriptive and clear

## Troubleshooting

### Styling Issues
- Verify ButtonLib.css is imported
- Check for CSS conflicts with Material-UI theme
- Ensure `!important` declarations are not overridden
- Use browser dev tools to inspect applied styles

### Click Handler Issues
- Ensure `onClick` prop is provided
- Verify button type matches expected ButtonType values
- Check that click handler accepts ButtonType parameter
- Debug using console.log in click handler

### Icon Display Problems
- Verify lucide-react is properly installed
- Check that icons are imported correctly
- Ensure icon sizes are appropriate (14px)
- Test with different button types to isolate issues

### TypeScript Errors
- Ensure ButtonType is imported correctly
- Verify onClick handler signature matches interface
- Check that button type prop is one of the allowed values
- Use type assertion if needed for dynamic types

### Layout Issues
- Check minimum width settings (70px)
- Verify button grouping and spacing
- Test responsive behavior with different screen sizes
- Use flexbox or grid for proper button alignment

### Integration Problems
- Ensure component is exported/imported correctly
- Check for version compatibility with Material-UI
- Verify CSS class names don't conflict with other styles
- Test integration with ActionButtonGroup component