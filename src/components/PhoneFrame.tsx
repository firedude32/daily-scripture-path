import { ReactNode } from "react";

/**
 * App shell. Mobile: full-bleed paper. Desktop: a centered narrow column
 * (~440px) on the same paper background — no phone bezel, no notch.
 *
 * Children render inside a positioned wrapper so absolute-positioned
 * descendants (TabBar, sheets, modals) keep working unchanged.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: "var(--color-paper)" }}
    >
      <div
        className="relative w-full md:max-w-[440px] min-h-screen"
        style={{
          background: "var(--color-paper)",
          boxShadow: "0 0 0 1px var(--color-rule)",
        }}
      >
        <div className="relative w-full min-h-screen">{children}</div>
      </div>
    </div>
  );
}
