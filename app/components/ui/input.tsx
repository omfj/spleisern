import { InputHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        "border border-gray-300 text-sm font-medium shadow-inner h-8 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent px-2 w-full",
        className
      )}
      {...props}
    />
  );
};
