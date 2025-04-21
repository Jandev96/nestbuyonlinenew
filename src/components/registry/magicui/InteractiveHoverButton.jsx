import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Link } from "react-router-dom";

const InteractiveHoverButton = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "group relative inline-flex items-center overflow-hidden rounded-full border border-primary bg-background px-6 py-2 text-sm font-semibold text-primary shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          className
        )}
        {...props}
      >
        {/* Initial content */}
        <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          <div className="h-2 w-2 rounded-full bg-primary transition-transform group-hover:scale-110" />
          <span>{children}</span>
        </div>

        {/* Hover effect content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-primary-foreground">
          <span>{children}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
