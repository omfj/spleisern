import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type StepperProps = HTMLAttributes<HTMLDivElement>;

export const Stepper = ({ className, ...props }: StepperProps) => {
  return <div className={cn("flex gap-4", className)} {...props} />;
};

type StepProps = HTMLAttributes<HTMLDivElement> & {
  step: number;
  isActive?: boolean;
  label?: string;
};

export const Step = ({ step, isActive, className, ...props }: StepProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-sm font-medium pb transition-colors duration-300 shadow-inner gap-2 rounded-full h-8 w-8",
        {
          "bg-primary text-gray-700": isActive,
          "bg-gray-200 text-gray-500": !isActive,
        },
        className
      )}
      {...props}
    >
      {step + 1}
    </div>
  );
};
