import { InputHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

export const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2",
        className
      )}
      {...props}
    />
  );
};
