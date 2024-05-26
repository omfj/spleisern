import { Link } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/dist/components";
import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const buttonCva = cva(
  "w-fit flex items-center justify-center font-medium h-8 text-sm py-2 px-4 rounded-md transition-all duration-300",
  {
    variants: {
      intent: {
        default: "bg-gray-200 text-foreground hover:bg-gray-100 border",
        success: "bg-green-500 text-white hover:bg-green-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonCva>;

export const Button = ({
  intent,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={buttonCva({ intent, className })} {...props}>
      {children}
    </button>
  );
};

type ButtonLinkProps = RemixLinkProps & VariantProps<typeof buttonCva>;

export const ButtonLink = ({
  intent,
  className,
  children,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link className={buttonCva({ intent, className })} {...props}>
      {children}
    </Link>
  );
};
