import { useState, useEffect } from "react";
import "./Textbox.css";
import { TextField } from "@mui/material";

export interface TextboxLibProps {
  value?: string;
  controlName?: string;
  label?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  isRequired?: boolean;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "idno";
  size?: "small" | "medium";
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  showValidation?: boolean; // Force show validation errors
  onValueChange?: (data: FormValueChangeEvent) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface FormValueChangeEvent {
  controlName: string;
  value: string | number;
  valid: boolean;
}

export default function TextboxLib({
  value: initialValue = "",
  controlName = "",
  label,
  placeholder,
  minLength = 0,
  maxLength,
  required = false,
  isRequired = false,
  disabled = false,
  type = "text",
  size = "medium",
  fullWidth = false,
  error = false,
  helperText,
  showValidation = false,
  onValueChange,
  onChange,
  onBlur,
  onFocus,
  onKeyPress,
}: TextboxLibProps) {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Update internal value when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Trigger validation when showValidation prop changes to true
  useEffect(() => {
    if (showValidation) {
      const valid = validateValue(value);
      setIsValid(valid);
    }
  }, [showValidation]);

  // Validation function
  const validateValue = (val: string): boolean => {
    if (isRequired && !val.trim()) {
      setErrorMessage("This field is required");
      return false;
    }

    if (minLength > 0 && val.length < minLength) {
      setErrorMessage(`Minimum length is ${minLength} characters`);
      return false;
    }

    if (maxLength && val.length > maxLength) {
      setErrorMessage(`Maximum length is ${maxLength} characters`);
      return false;
    }

    // Email validation
    if (type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // URL validation
    if (type === "url" && val && !/^https?:\/\/.+/.test(val)) {
      setErrorMessage("Please enter a valid URL");
      return false;
    }

    // Password validation
    if (type === "password" && val) {
      if (val.length < 8) {
        setErrorMessage("Password must be at least 8 characters long");
        return false;
      }
      if (!/(?=.*[a-z])/.test(val)) {
        setErrorMessage("Password must contain at least one lowercase letter");
        return false;
      }
      if (!/(?=.*[A-Z])/.test(val)) {
        setErrorMessage("Password must contain at least one uppercase letter");
        return false;
      }
      if (!/(?=.*\d)/.test(val)) {
        setErrorMessage("Password must contain at least one number");
        return false;
      }
      if (!/(?=.*[@$!%*?&])/.test(val)) {
        setErrorMessage("Password must contain at least one special character (@$!%*?&)");
        return false;
      }
    }

    // ID Number validation
    if (type === "idno" && val) {
      if (!/^\d+$/.test(val)) {
        setErrorMessage("ID Number must contain only numbers");
        return false;
      }
      if (val.length !== 12) {
        setErrorMessage("ID Number must be exactly 12 digits");
        return false;
      }

      // Validate month (positions 3-4)
      const month = parseInt(val.substring(2, 4));
      if (month < 1 || month > 12) {
        setErrorMessage("Invalid ID No.");
        return false;
      }
    }

    setErrorMessage("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    const valid = validateValue(newValue);
    setIsValid(valid);

    // Call custom onChange if provided
    if (onChange) {
      onChange(e);
    }

    // Call onValueChange with validation data
    if (onValueChange) {
      onValueChange({
        controlName: controlName || label || "",
        value: newValue,
        valid: valid,
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const valid = validateValue(value);
    setIsValid(valid);

    if (onBlur) {
      onBlur(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  // Determine if we should show error state
  // Show error if: manually set error prop, OR field is invalid and has been touched (value.length > 0), OR showValidation is true
  const showError = error || (!isValid && (value.length > 0 || showValidation));

  // For idno type, show info message by default
  let displayHelperText = helperText || errorMessage;
  if (type === "idno" && !errorMessage && !helperText) {
    displayHelperText = "No Dash '-'";
  }

  const displayLabel = isRequired ? (
    <>
      {label} <span style={{ color: '#ff4d4d' }}>*</span>
    </>
  ) : label;

  return (
    <div className="textbox-container">
      <TextField
        id={controlName || `textbox-${label}`}
        label={displayLabel}
        placeholder={placeholder}
        value={value}
        type={type}
        size={size}
        fullWidth={fullWidth}
        required={required}
        disabled={disabled}
        error={showError}
        helperText={displayHelperText}
        variant="outlined"
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyPress={handleKeyPress}
        inputProps={{
          minLength,
          maxLength,
        }}
        className="textbox-field"
        slotProps={{
          formHelperText: {
            sx: errorMessage ? { color: '#ff4d4d !important' } : {}
          }
        }}
      />
    </div>
  );
}
