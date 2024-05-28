import { InputHTMLAttributes, forwardRef } from "react";

import { cn } from "~/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "border border-gray-300 text-sm font-medium shadow-inner h-8 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent px-2 w-full",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
