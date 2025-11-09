# Form Validation Guide

A simple and reusable validation system for React forms using TypeScript.

## Quick Start

### 1. Import the validation utilities

```tsx
import {
  type ValidationState,
  updateValidationState,
  validateRequiredFields,
} from "../../utils/formValidation";
```

### 2. Add validation state to your component

```tsx
const [validationState, setValidationState] = useState<ValidationState>({});
```

### 3. Update your form change handler

```tsx
const formChange = (e: FormValueChangeEvent) => {
  setForm({ ...form, [e.controlName]: e.value });
  // Track validation state for each field
  updateValidationState(e.controlName, e.valid, setValidationState);
};
```

### 4. Add validation before submit

```tsx
const onClickSave = () => {
  // Define which fields are required
  const requiredFields = ["name", "email", "password"];

  // Validate all required fields
  const isValid = validateRequiredFields(requiredFields, validationState);

  if (!isValid) {
    // Show error notification
    setNotification({
      show: true,
      type: "error",
      message: "Please fill in all required fields correctly",
    });
    return;
  }

  // If validation passes, proceed with save
  handleSave();
};
```

### 5. Make sure fields have `isRequired={true}` prop

```tsx
<TextboxLib
  label="Name"
  controlName="name"
  value={form.name}
  isRequired={true}  // ← Shows asterisk (*) and enables validation
  onValueChange={(e) => formChange(e)}
/>

<SelectLib
  label="Role"
  controlName="role"
  value={form.role}
  isRequired={true}  // ← Shows asterisk (*) and enables validation
  onValueChange={(e) => formChange(e)}
/>
```

## Complete Example

```tsx
import { useState } from "react";
import TextboxLib from "../../components/TextboxLib";
import SelectLib from "../../components/SelectLib";
import ButtonLib from "../../components/ButtonLib/ButtonLib";
import SnackBarLib, { type SnackBarType } from "../../components/SnackBarLib/SnackBarLib";
import type { FormValueChangeEvent } from "../../components/TextboxLib/TextboxLib";
import {
  type ValidationState,
  updateValidationState,
  validateRequiredFields,
} from "../../utils/formValidation";

export default function MyForm() {
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Validation state
  const [validationState, setValidationState] = useState<ValidationState>({});

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    type: SnackBarType;
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  // Handle form field changes
  const formChange = (e: FormValueChangeEvent) => {
    setForm({ ...form, [e.controlName]: e.value });
    updateValidationState(e.controlName, e.valid, setValidationState);
  };

  // Handle save button click
  const onSave = () => {
    // Define required fields
    const requiredFields = ["name", "email", "role"];

    // Validate
    const isValid = validateRequiredFields(requiredFields, validationState);

    if (!isValid) {
      setNotification({
        show: true,
        type: "error",
        message: "Please fill in all required fields correctly",
      });
      return;
    }

    // Proceed with save logic
    console.log("Form is valid, saving...", form);

    setNotification({
      show: true,
      type: "success",
      message: "Data saved successfully!",
    });
  };

  return (
    <>
      <TextboxLib
        label="Name"
        controlName="name"
        value={form.name}
        isRequired={true}
        onValueChange={(e) => formChange(e)}
      />

      <TextboxLib
        label="Email"
        controlName="email"
        value={form.email}
        type="email"
        isRequired={true}
        onValueChange={(e) => formChange(e)}
      />

      <SelectLib
        label="Role"
        controlName="role"
        value={form.role}
        options={[
          { value: "1", label: "Admin" },
          { value: "2", label: "User" },
        ]}
        isRequired={true}
        onValueChange={(e) => formChange(e)}
      />

      <ButtonLib type="save" onClick={onSave} />

      <SnackBarLib
        type={notification.type}
        description={notification.message}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </>
  );
}
```

## Conditional Required Fields

If some fields are conditionally required based on other field values:

```tsx
const onSave = () => {
  const requiredFields = ["name", "email", "role"];

  // Add conditional required fields
  if (form.role === "student") {
    requiredFields.push("studentId", "programme");
  }

  const isValid = validateRequiredFields(requiredFields, validationState);

  if (!isValid) {
    setNotification({
      show: true,
      type: "error",
      message: "Please fill in all required fields correctly",
    });
    return;
  }

  // Continue with save...
};
```

## Advanced: Show Which Fields Are Invalid

Use `getInvalidFields` to show specific field names:

```tsx
import { getInvalidFields } from "../../utils/formValidation";

const onSave = () => {
  const requiredFields = ["name", "email", "role"];
  const invalidFields = getInvalidFields(requiredFields, validationState);

  if (invalidFields.length > 0) {
    setNotification({
      show: true,
      type: "error",
      message: `Please check: ${invalidFields.join(", ")}`,
    });
    return;
  }

  // Continue with save...
};
```

## Available Utilities

### `updateValidationState(fieldName, isValid, setValidationState)`
Updates the validation state for a specific field.

**Parameters:**
- `fieldName` (string): The controlName of the field
- `isValid` (boolean): Whether the field is valid
- `setValidationState`: React setState function

### `validateRequiredFields(requiredFields, validationState)`
Checks if all required fields are valid.

**Parameters:**
- `requiredFields` (string[]): Array of field controlNames that are required
- `validationState` (ValidationState): Current validation state

**Returns:** `boolean` - true if all valid, false otherwise

### `getInvalidFields(requiredFields, validationState)`
Gets array of field names that are invalid.

**Parameters:**
- `requiredFields` (string[]): Array of field controlNames to check
- `validationState` (ValidationState): Current validation state

**Returns:** `string[]` - Array of invalid field names

### `resetValidationState(setValidationState)`
Clears all validation state.

**Parameters:**
- `setValidationState`: React setState function

### `isFormTouched(validationState)`
Checks if user has interacted with the form.

**Parameters:**
- `validationState` (ValidationState): Current validation state

**Returns:** `boolean` - true if any field has been validated

## How It Works

1. **TextboxLib and SelectLib components** automatically validate their values based on:
   - `isRequired` prop (field must have a value)
   - `type` prop (email, password, url, idno have specific validation rules)
   - `minLength` and `maxLength` props
   - Built-in validation rules

2. **FormValueChangeEvent** includes a `valid` property that indicates if the field passed validation

3. **updateValidationState** stores each field's validation status in state

4. **validateRequiredFields** checks if all required fields exist and are valid before form submission

## Field Validation Rules

### TextboxLib
- **isRequired**: Must have non-empty value
- **email**: Must be valid email format
- **password**: Must have 8+ chars, uppercase, lowercase, number, special char
- **idno**: Must be 12 digits, valid Malaysian IC format
- **minLength**: Minimum character length
- **maxLength**: Maximum character length

### SelectLib
- **isRequired**: Must have selected value (not empty string)

## Best Practices

1. **Always set `isRequired={true}` prop** for required fields:
   - Shows red asterisk (*)
   - Enables validation logic
   - Shows error message in red (#ff4d4d) color

2. **Use controlName** to uniquely identify each field:
   ```tsx
   <TextboxLib controlName="email" ... />
   ```

3. **Validate before opening confirmation dialogs** to prevent unnecessary clicks

4. **Show user-friendly error messages** using SnackBarLib

5. **Reset validation state** when clearing forms:
   ```tsx
   resetValidationState(setValidationState);
   ```

## Troubleshooting

### Validation always fails
- Check that fields have `isRequired={true}` prop
- Verify `controlName` matches the field name in `requiredFields` array
- Ensure `onValueChange` is calling `updateValidationState`

### Validation not triggered
- Make sure `onValueChange` handler is properly calling `formChange`
- Check that `updateValidationState` is called in the change handler

### Field shows as invalid but has value
- Check the field's validation rules (e.g., password complexity, email format)
- Use browser console to inspect `validationState` object

### Error message not showing in red
- The error message color is automatically set to #ff4d4d (matching the asterisk color)
- Make sure `isRequired={true}` is set on the field
- Check that the field has an error (validation failed)
