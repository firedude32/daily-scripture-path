import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  maxHeight?: string;
}

/**
 * Lectio bottom sheet. Renders absolutely inside the nearest positioned
 * ancestor (the PhoneFrame Screen). Tap-outside or X to close.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  maxHeight = "82%",
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 z-50 flex items-end"
          style={{ background: "rgba(28, 25, 21, 0.4)" }}
        >
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-7 pt-7 pb-10 overflow-y-auto"
            style={{
              background: "var(--color-paper)",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTop: "1px solid var(--color-rule)",
              maxHeight,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {eyebrow && (
                  <p
                    className="font-ui uppercase tracking-[0.16em] text-[color:var(--color-ink-muted)]"
                    style={{ fontSize: 11, fontWeight: 500 }}
                  >
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h2
                    className="mt-1 font-display text-[color:var(--color-ink)]"
                    style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.15 }}
                  >
                    {title}
                  </h2>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 -m-2 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
