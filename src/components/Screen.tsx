import { ReactNode } from "react";
import { TabBar } from "./TabBar";

/**
 * Inner screen wrapper: scrollable content area with bottom padding for the
 * tab bar. Use `noTabs` for fullscreen flows (reading, quiz, onboarding).
 */
export function Screen({
  children,
  noTabs,
  className = "",
}: {
  children: ReactNode;
  noTabs?: boolean;
  className?: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      <div className={`flex-1 overflow-y-auto ${noTabs ? "" : "pb-24"} ${className}`}>
        {children}
      </div>
      {!noTabs && <TabBar />}
    </div>
  );
}
