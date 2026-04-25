import { ReactNode } from "react";

/**
 * iPhone-frame wrapper. Children render exactly once. On mobile (<md) the
 * surface is the full viewport. On desktop (>=md) the same surface sits
 * inside a centered iPhone-style bezel with a notch.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex md:items-center md:justify-center"
      style={{ background: "#2A2622" }}
    >
      {/* Desktop bezel — purely decorative, hidden on mobile */}
      <div
        aria-hidden
        className="hidden md:block absolute"
        style={{ width: 414, height: 868 }}
      />
      <div
        className="relative w-screen min-h-screen md:w-[414px] md:h-[868px] md:min-h-0 md:rounded-[42px] overflow-hidden md:m-3 md:shadow-[0_30px_80px_-20px_rgba(0,0,0,.55),0_0_0_2px_#1a1815,0_0_0_12px_#2a2622]"
        style={{ background: "var(--color-paper)" }}
      >
        <div className="relative w-full h-full">{children}</div>
        {/* Notch — desktop only */}
        <div
          aria-hidden
          className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
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
  );
}
