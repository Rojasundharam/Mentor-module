import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  success?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
}

/**
 * Enhanced Input Component
 *
 * An accessible form input component with rich features.
 * Features: icons, character counter, validation states, loading state
 *
 * @param type - Input type attribute
 * @param label - Input label text
 * @param placeholder - Placeholder text
 * @param value - Controlled input value
 * @param onChange - Change handler function
 * @param onBlur - Blur handler function
 * @param error - Error message to display
 * @param success - Success message to display
 * @param helperText - Helper text below input
 * @param required - Required field indicator
 * @param disabled - Disabled state
 * @param loading - Loading state
 * @param maxLength - Maximum character length
 * @param showCharCount - Show character counter
 * @param prefixIcon - Icon to display on the left
 * @param suffixIcon - Icon to display on the right
 * @param className - Additional custom classes
 * @param id - Input ID
 * @param name - Input name attribute
 * @param autoComplete - Autocomplete attribute
 */
export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  loading = false,
  maxLength,
  showCharCount = false,
  prefixIcon,
  suffixIcon,
  className = '',
  id,
  name,
  autoComplete
}: InputProps) {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const charCount = value?.length || 0;

  const baseInputStyles = `
    w-full px-4 py-3 rounded-lg border transition-colors-smooth
    focus:outline-none focus:ring-2
    disabled:bg-neutral-100 disabled:cursor-not-allowed
    ${prefixIcon ? 'pl-11' : ''}
    ${suffixIcon || loading ? 'pr-11' : ''}
  `.trim().replace(/\s+/g, ' ');

  const inputStyles = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
    : success
    ? 'border-success-500 focus:border-success-500 focus:ring-success-500'
    : 'border-neutral-300 focus:border-brand-green focus:ring-brand-green';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brand-green"
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
          {showCharCount && maxLength && (
            <span className={`text-xs ${charCount > maxLength ? 'text-error-500' : 'text-neutral-500'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Prefix Icon */}
        {prefixIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {prefixIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled || loading}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`${baseInputStyles} ${inputStyles}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` :
            success ? `${inputId}-success` :
            helperText ? `${inputId}-helper` : undefined
          }
        />

        {/* Suffix Icon or Loading Spinner */}
        {loading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        ) : suffixIcon ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {suffixIcon}
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-error-600 flex items-center gap-1"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}

      {/* Success Message */}
      {success && !error && (
        <p
          id={`${inputId}-success`}
          className="text-sm text-success-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          {success}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && !success && (
        <p
          id={`${inputId}-helper`}
          className="text-sm text-neutral-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * TextArea Component
 * Multiline text input variant
 */
interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  id?: string;
  name?: string;
}

export function TextArea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  id,
  name
}: TextAreaProps) {
  const inputId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = 'w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:bg-neutral-100 disabled:cursor-not-allowed resize-y';

  const textareaStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-neutral-300 focus:border-brand-green focus:ring-brand-green';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-brand-green"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`${baseStyles} ${textareaStyles}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="text-sm text-neutral-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
