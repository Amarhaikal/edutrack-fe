/**
 * Form Validation Utility
 *
 * A simple and reusable validation system for form fields.
 * Tracks validation state for each field and provides easy validation methods.
 *
 * @example
 * ```tsx
 * // 1. Initialize validation state
 * const [validationState, setValidationState] = useState<ValidationState>({});
 *
 * // 2. Handle field changes with validation tracking
 * const handleFieldChange = (e: FormValueChangeEvent) => {
 *   setForm({ ...form, [e.controlName]: e.value });
 *   updateValidationState(e.controlName, e.valid, setValidationState);
 * };
 *
 * // 3. Validate all required fields before submit
 * const isFormValid = validateRequiredFields(
 *   ['name', 'email', 'password'],
 *   validationState
 * );
 *
 * if (!isFormValid) {
 *   showError('Please fill in all required fields correctly');
 *   return;
 * }
 * ```
 */

/**
 * Validation state for a form
 * Key: field name (controlName)
 * Value: boolean indicating if field is valid
 */
export type ValidationState = Record<string, boolean>;

/**
 * Updates the validation state for a specific field
 *
 * @param fieldName - The name of the field to update
 * @param isValid - Whether the field is valid
 * @param setValidationState - React setState function for validation state
 *
 * @example
 * ```tsx
 * updateValidationState('email', true, setValidationState);
 * ```
 */
export const updateValidationState = (
  fieldName: string,
  isValid: boolean,
  setValidationState: React.Dispatch<React.SetStateAction<ValidationState>>
) => {
  setValidationState((prev) => ({
    ...prev,
    [fieldName]: isValid,
  }));
};

/**
 * Validates that all required fields are present and valid
 *
 * @param requiredFields - Array of field names that are required
 * @param validationState - Current validation state object
 * @param formData - Optional form data object to check field values when validationState is empty
 * @returns true if all required fields are valid, false otherwise
 *
 * @example
 * ```tsx
 * const requiredFields = ['name', 'email', 'password', 'role'];
 * const isValid = validateRequiredFields(requiredFields, validationState, form);
 *
 * if (!isValid) {
 *   alert('Please fill in all required fields');
 * }
 * ```
 */
export const validateRequiredFields = (
  requiredFields: string[],
  validationState: ValidationState,
  formData?: Record<string, any>
): boolean => {
  // If validationState is empty and formData is provided, check if required fields have values
  const isValidationStateEmpty = Object.keys(validationState).length === 0;

  if (isValidationStateEmpty && formData) {
    return requiredFields.every((field) => {
      const value = formData[field];
      // Check if field has a non-empty value
      return value !== undefined && value !== null && value !== '';
    });
  }

  // Check if all required fields exist in validation state and are valid
  return requiredFields.every((field) => {
    // If field not in validation state, consider it invalid
    if (!(field in validationState)) {
      return false;
    }
    // Return the validation status
    return validationState[field] === true;
  });
};

/**
 * Gets all invalid field names from the validation state
 *
 * @param requiredFields - Array of field names to check
 * @param validationState - Current validation state object
 * @returns Array of field names that are invalid
 *
 * @example
 * ```tsx
 * const invalidFields = getInvalidFields(['name', 'email'], validationState);
 * console.log(`Invalid fields: ${invalidFields.join(', ')}`);
 * // Output: "Invalid fields: email, password"
 * ```
 */
export const getInvalidFields = (
  requiredFields: string[],
  validationState: ValidationState
): string[] => {
  return requiredFields.filter((field) => {
    return !(field in validationState) || validationState[field] !== true;
  });
};

/**
 * Resets validation state to empty object
 * Useful when clearing form or starting fresh
 *
 * @param setValidationState - React setState function for validation state
 *
 * @example
 * ```tsx
 * resetValidationState(setValidationState);
 * ```
 */
export const resetValidationState = (
  setValidationState: React.Dispatch<React.SetStateAction<ValidationState>>
) => {
  setValidationState({});
};

/**
 * Checks if a form has been touched (has any validation state)
 *
 * @param validationState - Current validation state object
 * @returns true if any field has been validated, false otherwise
 *
 * @example
 * ```tsx
 * if (!isFormTouched(validationState)) {
 *   console.log('User hasn\'t interacted with the form yet');
 * }
 * ```
 */
export const isFormTouched = (validationState: ValidationState): boolean => {
  return Object.keys(validationState).length > 0;
};
