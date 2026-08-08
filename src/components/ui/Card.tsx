import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft transition-all duration-200",
        hoverEffect && "hover:shadow-card hover:border-slate-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
