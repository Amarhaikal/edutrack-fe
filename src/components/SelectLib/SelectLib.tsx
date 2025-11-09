import { useState, useEffect } from "react";
import "./SelectLib.css";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { FormValueChangeEvent } from "../TextboxLib/TextboxLib";

export interface SelectLibProps {
  value?: string | number;
  controlName?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  isRequired?: boolean;
  disabled?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  isRefData?: boolean;
  showValidation?: boolean; // Force show validation errors
  options: Array<{ value: string | number; label: string }>;
  onValueChange?: (data: FormValueChangeEvent) => void;
  onChange?: (e: SelectChangeEvent<string | number>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function SelectLib({
  value: initialValue = "",
  controlName = "",
  label,
  required = false,
  isRequired = false,
  disabled = false,
  size = "medium",
  fullWidth = false,
  error = false,
  helperText,
  options = [],
  showValidation = false,
  onValueChange,
  onChange,
  onBlur,
  onFocus,
  onOpen,
  onClose,
  isRefData = false,
}: SelectLibProps) {
  const [value, setValue] = useState<string | number>(initialValue);
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
  const validateValue = (val: string | number): boolean => {
    if (isRequired && (val === "" || val === undefined || val === null)) {
      setErrorMessage("This field is required");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleChange = (e: SelectChangeEvent<string | number>) => {
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

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const valid = validateValue(value);
    setIsValid(valid);

    if (onBlur) {
      onBlur(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Determine if we should show error state
  // Show error if: manually set error prop, OR field is invalid and has been touched, OR showValidation is true
  const showError = error || (!isValid && (value !== "" && value !== undefined && value !== null || showValidation));
  const displayHelperText = helperText || errorMessage;
  const displayLabel = isRequired ? (
    <>
      {label} <span style={{ color: '#ff4d4d' }}>*</span>
    </>
  ) : label;

  return (
    <div className="select-container">
      <FormControl
        fullWidth={fullWidth}
        size={size}
        error={showError}
        required={required}
        disabled={disabled}
        className="select-form-control"
      >
        <InputLabel id={`${controlName || label}-label`}>
          {displayLabel}
        </InputLabel>
        <Select
          labelId={`${controlName || label}-label`}
          id={controlName || `select-${label}`}
          value={value}
          label={displayLabel}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onOpen={handleOpen}
          onClose={handleClose}
          className="select-field"
        >
          {isRefData && <MenuItem value=""><em>None</em></MenuItem>}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {displayHelperText && (
          <div className={`select-helper-text ${errorMessage ? 'error' : ''}`}>
            {displayHelperText}
          </div>
        )}
      </FormControl>
    </div>
  );
}
