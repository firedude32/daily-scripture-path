import { ReactNode, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"> {
  selected?: boolean;
  interactive?: boolean;
  children: ReactNode;
  padding?: "md" | "sm" | "lg";
}

/**
 * Lectio card. Paper-light fill on Paper background, hairline Rule border,
 * 12px radius, no shadow. Selected state shifts border to Gold and bg to a
 * slightly warmer Paper Light.
 */
export function EditorialCard({
  selected,
  interactive,
  children,
  padding = "md",
  className,
  ...rest
}: Props) {
  const padCls = padding === "lg" ? "p-7" : padding === "sm" ? "p-4" : "p-6";
  return (
    <motion.div
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "rounded-[12px] border transition-colors",
        padCls,
        selected
          ? "border-[color:var(--color-gold)] bg-[color:var(--color-paper-light)]"
          : "border-[color:var(--color-rule)] bg-[color:var(--color-paper-light)]",
        className,
      )}
      {...(rest as object)}
    >
      {children}
    </motion.div>
  );
}
