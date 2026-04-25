import { ReactNode } from "react";

/**
 * iPhone-frame wrapper. Mobile: full viewport (Paper). Desktop: a centered
 * device frame on a soft warm gray surround. Children render exactly once;
 * the desktop chrome (notch, bezel) is added via decorative siblings.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "#2A2622" }}
    >
      {/* Mobile: full viewport, no frame */}
      <div
        className="md:hidden relative w-screen min-h-screen overflow-hidden"
        style={{ background: "var(--color-paper)" }}
      >
        {children}
      </div>
      {/* Desktop: centered iPhone-style frame */}
      <div
        className="hidden md:block relative"
        style={{ width: 414, height: 868 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 rounded-[54px] pointer-events-none"
          style={{
            background: "#0F0E0C",
            boxShadow:
              "0 30px 80px -20px rgba(0,0,0,.55), 0 0 0 2px #1a1815, 0 0 0 12px #2a2622",
          }}
        />
        <div
          className="absolute overflow-hidden"
          style={{ inset: 12, borderRadius: 42, background: "var(--color-paper)" }}
        >
          <div className="relative w-full h-full">{children}</div>
          {/* Notch */}
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            style={{
              width: 120,
              height: 28,
              background: "#0F0E0C",
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
            }}
          />
        </div>
      </div>
    </div>
  );
}
