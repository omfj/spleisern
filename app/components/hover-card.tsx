import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type HoverCardProps = HTMLAttributes<HTMLDivElement>;

export const HoverCard = ({ className, ...props }: HoverCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-xl shadow-inner border p-8 my-8",
        className
      )}
      {...props}
    />
  );
};
