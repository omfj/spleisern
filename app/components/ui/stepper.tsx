import { HTMLAttributes } from "react";

import { cn } from "~/utils/cn";

type StepperProps = HTMLAttributes<HTMLDivElement>;

export const Stepper = ({ className, ...props }: StepperProps) => {
  return (
    <div className={cn("flex w-full justify-between", className)} {...props} />
  );
};

type StepProps = HTMLAttributes<HTMLDivElement> & {
  step: number;
  isActive?: boolean;
  label?: string;
};

export const Step = ({
  step,
  label,
  isActive,
  className,
  ...props
}: StepProps) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className={cn(
          "flex items-center justify-center border text-sm font-medium transition-colors duration-300 shadow-inner rounded-full h-8 w-8",
          {
            "bg-primary text-white": isActive,
            "bg-gray-200 text-gray-500": !isActive,
          },
          className
        )}
        {...props}
      >
        {step + 1}
      </div>
      {label && (
        <p className="hidden sm:block text-gray-500 text-xs font-medium text-center">
          {label}
        </p>
      )}
    </div>
  );
};
