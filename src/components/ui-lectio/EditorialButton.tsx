import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "secondary" | "text";
type Size = "md" | "sm";

interface Props extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/**
 * Lectio button. 12px radius rectangle, no shadow, letter-spaced uppercase
 * UI-sans label. Variants: primary (solid Ink), gold (solid Gold/Ink text),
 * secondary (hairline Ink border), text (no border, underline on press).
 */
export const EditorialButton = forwardRef<HTMLButtonElement, Props>(function EditorialButton(
  { variant = "primary", size = "md", fullWidth = true, className, children, disabled, ...rest },
  ref,
) {
  const base =
    "inline-flex items-center justify-center font-ui uppercase tracking-[0.14em] font-medium transition-colors select-none disabled:opacity-40 disabled:cursor-not-allowed";
  const sizeCls =
    size === "sm" ? "text-[11px] px-5 py-3 rounded-[10px]" : "text-[13px] px-7 py-4 rounded-[12px]";
  const widthCls = fullWidth ? "w-full" : "";
  const variantCls =
    variant === "gold"
      ? "bg-[color:var(--color-gold)] text-[color:var(--color-ink)] hover:opacity-95"
      : variant === "primary"
        ? "bg-[color:var(--color-ink)] text-[color:var(--color-paper)] hover:opacity-95"
        : variant === "secondary"
          ? "bg-transparent text-[color:var(--color-ink)] border border-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-light)]"
          : "bg-transparent text-[color:var(--color-ink)] !px-0 !py-1 underline-offset-4 hover:underline";

  return (
    <motion.button
      ref={ref}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(base, sizeCls, widthCls, variantCls, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </motion.button>
  );
});
