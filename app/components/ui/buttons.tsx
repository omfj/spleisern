import { Link } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/dist/components";
import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const buttonCva = cva(
  "bg-gray-200 shadow-inner w-fit flex items-center justify-center font-medium h-8 text-sm text-foreground py-2 px-4 rounded-md"
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonCva>;

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={buttonCva({ className })} {...props}>
      {children}
    </button>
  );
};

type ButtonLinkProps = RemixLinkProps & VariantProps<typeof buttonCva>;

export const ButtonLink = ({
  children,
  className,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link className={buttonCva({ className })} {...props}>
      {children}
    </Link>
  );
};
