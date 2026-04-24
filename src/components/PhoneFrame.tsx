import { ReactNode } from "react";

/**
 * iPhone-frame wrapper. On desktop, renders a 390x844 framed device centered
 * on a dark surface. On mobile, fills the viewport.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[oklch(0.18_0.005_60)]">
      {/* Mobile: full viewport */}
      <div className="md:hidden relative w-screen min-h-screen bg-background overflow-hidden">
        {children}
      </div>
      {/* Desktop: iPhone frame */}
      <div className="hidden md:block relative" style={{ width: 414, height: 868 }}>
        <div
          className="absolute inset-0 rounded-[54px] bg-black"
          style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,.6), 0 0 0 2px #1a1a1a, 0 0 0 12px #2a2a2a" }}
        />
        <div
          className="absolute overflow-hidden bg-background"
          style={{ inset: 12, borderRadius: 42 }}
        >
          <div className="relative w-full h-full">{children}</div>
          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-50"
            style={{ width: 120, height: 28, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}
          />
        </div>
      </div>
    </div>
  );
}
