import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useHydrateStore, useAppState } from "@/state/store";
import { MilestoneShareModal } from "@/components/MilestoneShareModal";
import { Skeleton, SkeletonText } from "@/components/ui-lectio/Skeleton";
import { AddToHomeScreenSheet } from "@/components/AddToHomeScreenSheet";
import { useRouterState } from "@tanstack/react-router";


export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function HydrationSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <div className="mx-auto max-w-[430px] px-7 pt-14 pb-10">
        {/* Header eyebrow + greeting */}
        <SkeletonText width={80} height={10} />
        <div className="mt-5">
          <SkeletonText width="70%" height={26} />
          <div className="mt-3">
            <SkeletonText width="45%" height={14} />
          </div>
        </div>

        {/* Primary chapter card */}
        <Skeleton className="mt-10" style={{ height: 168 }} />

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <Skeleton style={{ height: 78 }} />
          <Skeleton style={{ height: 78 }} />
          <Skeleton style={{ height: 78 }} />
        </div>

        {/* Note block */}
        <div className="mt-10">
          <SkeletonText width={60} height={10} />
          <Skeleton className="mt-4" style={{ height: 110 }} />
        </div>
      </div>
    </div>
  );
}

function AuthenticatedLayout() {
  useHydrateStore();
  const { hydrated } = useAppState();
  if (!hydrated) return <HydrationSkeleton />;
  return (
    <>
      <Outlet />
      <MilestoneShareModal />
    </>
  );
}
