import { ReactNode } from "react";
import { TabBar } from "./TabBar";

/**
 * Inner screen wrapper. Fills the PhoneFrame column. Scrolls vertically.
 * `noTabs` for fullscreen flows (reading, quiz, onboarding, celebrations).
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
    <div className="relative w-full min-h-screen flex flex-col bg-background">
      <div className={`flex-1 ${noTabs ? "" : "pb-24"} ${className}`}>
        {children}
      </div>
      {!noTabs && <TabBar />}
    </div>
  );
}
