# TextboxLib Component

A reusable text input component built with Material-UI's TextField, featuring comprehensive validation and form integration capabilities.

## Features

- **Material-UI Integration**: Built on top of Material-UI's TextField component
- **Type-based Validation**: Built-in validation for email, ID numbers, and more
- **Required Field Support**: Visual asterisk indicators for required fields
- **Form Integration**: Emits value changes with validation status
- **Comprehensive Validation**: Length, format, and type-specific validation
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | ❌ | `""` | Current value of the textbox |
| `controlName` | `string` | ❌ | `""` | Unique identifier for the control |
| `label` | `string` | ❌ | - | Label text for the input field |
| `placeholder` | `string` | ❌ | - | Placeholder text |
| `minLength` | `number` | ❌ | `0` | Minimum allowed character length |
| `maxLength` | `number` | ❌ | - | Maximum allowed character length |
| `required` | `boolean` | ❌ | `false` | HTML required attribute |
| `isRequired` | `boolean` | ❌ | `false` | Shows red asterisk (*) for required fields |
| `disabled` | `boolean` | ❌ | `false` | Disables the input field |
| `type` | `InputType` | ❌ | `"text"` | Input type (text, email, password, number, tel, url, idno) |
| `size` | `"small" \| "medium"` | ❌ | `"medium"` | Size of the input field |
| `fullWidth` | `boolean` | ❌ | `false` | Makes input take full width |
| `error` | `boolean` | ❌ | `false` | Shows error state |
| `helperText` | `string` | ❌ | - | Helper text below the input |
| `onValueChange` | `(data: FormValueChangeEvent) => void` | ❌ | - | Callback for value changes with validation data |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | ❌ | - | Standard onChange callback |
| `onBlur` | `(e: React.FocusEvent<HTMLInputElement>) => void` | ❌ | - | onBlur callback |
| `onFocus` | `(e: React.FocusEvent<HTMLInputElement>) => void` | ❌ | - | onFocus callback |
| `onKeyPress` | `(e: React.KeyboardEvent<HTMLInputElement>) => void` | ❌ | - | onKeyPress callback |

## Types and Interfaces

### InputType

```typescript
type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "idno";
```

### FormValueChangeEvent

```typescript
interface FormValueChangeEvent {
  controlName: string;  // Name of the control that changed
  value: string | number; // Current value of the textbox
  valid: boolean;       // Whether the value passes validation
}
```

## Usage Examples

### Basic Usage

```tsx
import TextboxLib from '../components/TextboxLib/TextboxLib';
import type { FormValueChangeEvent } from '../components/TextboxLib/TextboxLib';

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleValueChange = (e: FormValueChangeEvent) => {
    setSearchTerm(e.value as string);
  };

  return (
    <TextboxLib
      value={searchTerm}
      controlName="searchTerm"
      label="Search by name"
      onValueChange={handleValueChange}
    />
  );
}
```

### Required Fields with Asterisk

```tsx
<TextboxLib
  value={username}
  controlName="username"
  label="Username"
  isRequired={true}
  minLength={3}
  maxLength={20}
  onValueChange={handleValueChange}
/>
```

### Email Validation

```tsx
<TextboxLib
  value={email}
  controlName="email"
  label="Email Address"
  type="email"
  isRequired={true}
  onValueChange={handleValueChange}
/>
```

### Password Validation

```tsx
<TextboxLib
  value={password}
  controlName="password"
  label="Password"
  type="password"
  isRequired={true}
  minLength={8}
  onValueChange={handleValueChange}
/>
```

### Malaysian ID Number Validation

```tsx
<TextboxLib
  value={idNumber}
  controlName="idNumber"
  label="ID Number"
  type="idno"
  isRequired={true}
  onValueChange={handleValueChange}
/>
```

### Form Integration with Validation

```tsx
function MyComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idno: ''
  });

  const handleValueChange = (data: FormValueChangeEvent) => {
    console.log('Textbox value changed:', data);

    // Update form data
    setFormData(prev => ({ ...prev, [data.controlName]: data.value }));

    if (data.valid) {
      console.log(`${data.controlName} is valid with value: ${data.value}`);
      // Handle valid input
    } else {
      console.log(`${data.controlName} is invalid with value: ${data.value}`);
      // Handle invalid input
    }
  };

  return (
    <div>
      <TextboxLib
        value={formData.name}
        controlName="name"
        label="Full Name"
        isRequired={true}
        minLength={2}
        maxLength={100}
        onValueChange={handleValueChange}
      />
      <TextboxLib
        value={formData.email}
        controlName="email"
        label="Email Address"
        type="email"
        isRequired={true}
        onValueChange={handleValueChange}
      />
      <TextboxLib
        value={formData.idno}
        controlName="idno"
        label="ID Number"
        type="idno"
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

  return (
    <FormLayout>
      <TextboxLib
        label="Name"
        controlName="name"
        value={form.name}
        isRequired={true}
        maxLength={150}
        onValueChange={formChange}
      />
      <TextboxLib
        label="Email"
        controlName="email"
        value={form.email}
        type="email"
        onValueChange={formChange}
        isRequired={true}
      />
      <TextboxLib
        label="ID No"
        controlName="idno"
        value={form.idno}
        type="idno"
        onValueChange={formChange}
        isRequired={true}
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

## Validation Rules

The component automatically validates input based on the following rules:

### General Validation
1. **required**: Field must not be empty when required is true
2. **minLength**: Value must have at least `minLength` characters
3. **maxLength**: Value must not exceed `maxLength` characters

### Type-specific Validation

#### Email Type (`type="email"`)
- Must match email format: `user@domain.com`
- Shows error: "Please enter a valid email address"

#### Password Type (`type="password"`)
- Must be at least 8 characters long
- Must contain at least one lowercase letter (a-z)
- Must contain at least one uppercase letter (A-Z)
- Must contain at least one number (0-9)
- Must contain at least one special character (@$!%*?&)
- Error messages:
  - "Password must be at least 8 characters long"
  - "Password must contain at least one lowercase letter"
  - "Password must contain at least one uppercase letter"
  - "Password must contain at least one number"
  - "Password must contain at least one special character (@$!%*?&)"

#### ID Number Type (`type="idno"`)
- Must be exactly 12 digits
- Only numeric characters allowed (0-9)
- Month validation: positions 3-4 must be 01-12
- Shows info message: "No Dash '-'" by default
- Error messages:
  - "ID Number must contain only numbers"
  - "ID Number must be exactly 12 digits"
  - "Invalid ID No." (for invalid month)

#### URL Type (`type="url"`)
- Must start with http:// or https://
- Shows error: "Please enter a valid URL"

### Malaysian ID Number Format
The `idno` type validates Malaysian Identity Card numbers with the format: `YYMMDDSSNNNG`
- **YY**: Year of birth (last 2 digits)
- **MM**: Month of birth (01-12)
- **DD**: Day of birth (01-31)
- **SS**: State code (e.g., 10 for Selangor)
- **NNN**: Sequential number
- **G**: Gender digit (odd=male, even=female)

Example: `010912102355` (born 12/09/2001 in Selangor, male)

## Visual Features

### Required Field Indicators
- Uses red asterisk (*) when `isRequired={true}`
- Asterisk color: `#ff4d4d` (10% lighter red)
- Label remains in original color

### Helper Text and Error States
- Shows validation errors below the input
- Info messages for specific types (e.g., "No Dash '-'" for ID numbers)
- Error state changes input border color

## Dependencies

- `@mui/material` - Material-UI components (TextField)
- React 16.8+ (for hooks support)
- TypeScript (for type definitions)

## Component Architecture

### State Management
- Internal state for value, validation status, and error messages
- Controlled component pattern - parent manages the value
- Real-time validation on every change

### Event Handling
- `onValueChange`: Emits FormValueChangeEvent with validation data
- Standard React events: `onChange`, `onBlur`, `onFocus`, `onKeyPress`
- Validation occurs on both change and blur events

### Integration with Form Systems
- Works seamlessly with FormLayout component for 2x2 grid layouts
- Compatible with Material-UI form validation
- Supports both controlled and uncontrolled patterns

## Troubleshooting

### Value not updating immediately
- Ensure you're updating state in the `onValueChange` callback
- Check that the `value` prop is properly connected to state

### Validation not working
- Verify the `type` prop is correctly set for type-specific validation
- Check that validation rules (minLength, maxLength) are properly configured
- Ensure the `onValueChange` callback is handling the validation status

### ID Number validation issues
- Verify the input is exactly 12 digits
- Check that month value (positions 3-4) is between 01-12
- Ensure only numeric characters are entered

### Required field asterisk not showing
- Confirm `isRequired={true}` is set
- Check that the label prop is provided

### Styling issues
- Verify Material-UI theme is properly configured
- Check that the component is receiving proper Material-UI styling
- Ensure any custom CSS doesn't conflict with Material-UI styles

### Form integration problems
- Make sure FormValueChangeEvent is properly typed
- Verify controlName matches the form state property
- Check that form state updates are handled correctly in onValueChange