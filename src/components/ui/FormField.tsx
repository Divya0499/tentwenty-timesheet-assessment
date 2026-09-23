import { ReactNode } from "react";

interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

/** Label + input slot + error message, shared across the app's forms. */
export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared Tailwind classes for text/date/number/select inputs. */
export const inputClasses =
  "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm " +
  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export const inputErrorClasses = "border-red-300 focus:border-red-500 focus:ring-red-500";
