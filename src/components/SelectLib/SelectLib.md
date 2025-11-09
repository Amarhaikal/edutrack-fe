# SelectLib Component

A reusable select dropdown component built with Material-UI's Select, featuring comprehensive validation and form integration capabilities.

## Features

- **Material-UI Integration**: Built on top of Material-UI's Select and FormControl components
- **Required Field Support**: Visual asterisk indicators for required fields
- **Form Integration**: Emits value changes with validation status
- **Reference Data Support**: Optional "None" option for reference data scenarios
- **Comprehensive Validation**: Required field validation
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string \| number` | ❌ | `""` | Current selected value |
| `controlName` | `string` | ❌ | `""` | Unique identifier for the control |
| `label` | `string` | ❌ | - | Label text for the select field |
| `placeholder` | `string` | ❌ | - | Placeholder text |
| `required` | `boolean` | ❌ | `false` | HTML required attribute |
| `isRequired` | `boolean` | ❌ | `false` | Shows red asterisk (*) for required fields |
| `disabled` | `boolean` | ❌ | `false` | Disables the select field |
| `size` | `"small" \| "medium"` | ❌ | `"medium"` | Size of the select field |
| `fullWidth` | `boolean` | ❌ | `false` | Makes select take full width |
| `error` | `boolean` | ❌ | `false` | Shows error state |
| `helperText` | `string` | ❌ | - | Helper text below the select |
| `isRefData` | `boolean` | ❌ | `false` | Adds "None" option for reference data |
| `options` | `Array<{ value: string \| number; label: string }>` | ✅ | - | Array of select options |
| `onValueChange` | `(data: FormValueChangeEvent) => void` | ❌ | - | Callback for value changes with validation data |
| `onChange` | `(e: SelectChangeEvent<string \| number>) => void` | ❌ | - | Standard onChange callback |
| `onBlur` | `(e: React.FocusEvent<HTMLElement>) => void` | ❌ | - | onBlur callback |
| `onFocus` | `(e: React.FocusEvent<HTMLElement>) => void` | ❌ | - | onFocus callback |
| `onOpen` | `() => void` | ❌ | - | Callback when dropdown opens |
| `onClose` | `() => void` | ❌ | - | Callback when dropdown closes |

## Types and Interfaces

### FormValueChangeEvent

```typescript
interface FormValueChangeEvent {
  controlName: string;  // Name of the control that changed
  value: string | number; // Current selected value
  valid: boolean;       // Whether the value passes validation
}
```

### Option Interface

```typescript
interface Option {
  value: string | number; // The option value
  label: string;         // Display text for the option
}
```

## Usage Examples

### Basic Usage

```tsx
import SelectLib from '../components/SelectLib/SelectLib';
import type { FormValueChangeEvent } from '../components/TextboxLib/TextboxLib';

function MyComponent() {
  const [selectedRole, setSelectedRole] = useState('');

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' }
  ];

  const handleValueChange = (e: FormValueChangeEvent) => {
    setSelectedRole(e.value as string);
  };

  return (
    <SelectLib
      options={roleOptions}
      value={selectedRole}
      controlName="role"
      label="Select Role"
      onValueChange={handleValueChange}
    />
  );
}
```

### Required Fields with Asterisk

```tsx
<SelectLib
  options={roleOptions}
  value={selectedRole}
  controlName="role"
  label="Role"
  isRequired={true}
  onValueChange={handleValueChange}
/>
```

### With Reference Data Support

```tsx
<SelectLib
  options={departmentOptions}
  value={selectedDepartment}
  controlName="department"
  label="Department"
  isRefData={true}
  isRequired={true}
  onValueChange={handleValueChange}
/>
```

### Form Integration with Validation

```tsx
function MyComponent() {
  const [formData, setFormData] = useState({
    category: '',
    priority: '',
    status: ''
  });

  const handleValueChange = (data: FormValueChangeEvent) => {
    console.log('Select value changed:', data);

    // Update form data
    setFormData(prev => ({ ...prev, [data.controlName]: data.value }));

    if (data.valid) {
      console.log(`${data.controlName} is valid with value: ${data.value}`);
      // Handle valid selection
    } else {
      console.log(`${data.controlName} is invalid`);
      // Handle invalid selection (empty required field)
    }
  };

  const categoryOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' }
  ];

  const priorityOptions = [
    { value: 1, label: 'High' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Low' }
  ];

  return (
    <div>
      <SelectLib
        options={categoryOptions}
        value={formData.category}
        controlName="category"
        label="Category"
        isRequired={true}
        onValueChange={handleValueChange}
      />
      <SelectLib
        options={priorityOptions}
        value={formData.priority}
        controlName="priority"
        label="Priority"
        isRequired={true}
        onValueChange={handleValueChange}
      />
    </div>
  );
}
```

### Using with FormLayout Component

```tsx
import FormLayout from '../components/FormLayout/FormLayout';

function UserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    idno: "",
    role: "",
  });

  const formChange = (e: FormValueChangeEvent) => {
    setForm({ ...form, [e.controlName]: e.value });
  };

  const roleOptions = [
    { value: '1', label: 'Administrator' },
    { value: '2', label: 'Teacher' },
    { value: '3', label: 'Student' }
  ];

  return (
    <FormLayout>
      <TextboxLib
        label="Name"
        controlName="name"
        value={form.name}
        isRequired={true}
        onValueChange={formChange}
      />
      <TextboxLib
        label="Email"
        controlName="email"
        value={form.email}
        type="email"
        isRequired={true}
        onValueChange={formChange}
      />
      <TextboxLib
        label="ID No"
        controlName="idno"
        value={form.idno}
        type="idno"
        isRequired={true}
        onValueChange={formChange}
      />
      <SelectLib
        options={roleOptions}
        label="Role"
        controlName="role"
        value={form.role}
        onValueChange={formChange}
        isRequired={true}
      />
    </FormLayout>
  );
}
```

### Disabled State

```tsx
<SelectLib
  options={statusOptions}
  value="pending"
  label="Status"
  disabled={true}
  helperText="Status cannot be changed"
/>
```

### Custom Event Handling

```tsx
<SelectLib
  options={countryOptions}
  value={selectedCountry}
  controlName="country"
  label="Country"
  onOpen={() => console.log('Dropdown opened')}
  onClose={() => console.log('Dropdown closed')}
  onFocus={() => console.log('Select focused')}
  onBlur={() => console.log('Select blurred')}
  onValueChange={handleValueChange}
/>
```

## Validation Rules

The component automatically validates input based on the following rules:

### Required Field Validation
1. **required**: Field must have a selected value when required is true
2. **Empty values**: Validates against empty string, undefined, and null values
3. **Valid**: Returns `true` if validation passes, `false` otherwise

## Visual Features

### Required Field Indicators
- Uses red asterisk (*) when `isRequired={true}`
- Asterisk color: `#ff4d4d` (10% lighter red)
- Label remains in original color

### Reference Data Support
- When `isRefData={true}`, adds a "None" option at the top
- Useful for optional reference data selections
- "None" option has empty string value

### Helper Text and Error States
- Shows validation errors below the select
- Custom helper text support
- Error state changes select border color

## Dependencies

- `@mui/material` - Material-UI components (Select, MenuItem, FormControl, InputLabel)
- React 16.8+ (for hooks support)
- TypeScript (for type definitions)

## Component Architecture

### State Management
- Internal state for value, validation status, and error messages
- Controlled component pattern - parent manages the value
- Real-time validation on value change

### Event Handling
- `onValueChange`: Emits FormValueChangeEvent with validation data
- Standard Material-UI events: `onChange`, `onBlur`, `onFocus`, `onOpen`, `onClose`
- Validation occurs on both change and blur events

### Integration with Form Systems
- Works seamlessly with FormLayout component for 2x2 grid layouts
- Compatible with Material-UI form validation
- Supports both controlled and uncontrolled patterns

## Troubleshooting

### Value not updating immediately
- Ensure you're updating state in the `onValueChange` callback
- Check that the `value` prop is properly connected to state

### Options not displaying
- Verify the `options` prop is properly formatted as an array
- Check that each option has both `value` and `label` properties
- Ensure option values are strings or numbers

### Validation not working
- Check that validation rules are properly configured
- Ensure the `onValueChange` callback is handling the validation status
- Verify required field validation is set up correctly

### Required field asterisk not showing
- Confirm `isRequired={true}` is set
- Check that the label prop is provided

### Reference data "None" option not appearing
- Ensure `isRefData={true}` is set
- The "None" option will appear as the first option with empty string value

### Styling issues
- Verify Material-UI theme is properly configured
- Check that the component is receiving proper Material-UI styling
- Ensure any custom CSS doesn't conflict with Material-UI styles

### Form integration problems
- Make sure FormValueChangeEvent is properly typed
- Verify controlName matches the form state property
- Check that form state updates are handled correctly in onValueChange