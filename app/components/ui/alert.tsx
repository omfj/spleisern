import { VariantProps, cva } from "class-variance-authority";
import { HTMLAttributes } from "react";

const alertCva = cva(
  "flex items-center p-4 gap-2 rounded-md border border-l-4 text-sm font-medium transition-colors duration-300",
  {
    variants: {
      intent: {
        info: "bg-blue-100 text-blue-800 border-blue-200",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        danger: "bg-red-100 text-red-800 border-red-200",
      },
    },
    defaultVariants: {
      intent: "info",
    },
  }
);

type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertCva>;

export const Alert = ({
  intent,
  className,
  children,
  ...props
}: AlertProps) => {
  const Icon = intent === "danger" ? "🔥" : "☝🏻";

  return (
    <div className={alertCva({ intent, className })} {...props}>
      <span>{Icon}</span>
      {children}
    </div>
  );
};
