"use client";

import * as React from "react";
import { UseFormRegister, FieldError, Path, FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FormInputProps<T extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: Path<T>;
  label: string;
  // Accepts a FieldError object or a plain string
  error?: FieldError | string;
  // Optional: pass the register function to bind internally
  register?: UseFormRegister<T>;
}

function FormInputInner<T extends FieldValues = FieldValues>(
  { id, label, error, className, register: formRegister, type, ...props }: FormInputProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  const errorMessage =
    typeof error === "string" ? error : error?.message;

  const registerProps = formRegister ? formRegister(id) : {};

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`${errorMessage ? "border-red-500" : ""} ${isPassword ? "pr-10" : ""} ${className || ""}`}
          {...registerProps}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {errorMessage && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

const FormInput = React.forwardRef(FormInputInner) as <
  T extends FieldValues = FieldValues
>(
  props: FormInputProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => React.ReactElement;

export default FormInput;

