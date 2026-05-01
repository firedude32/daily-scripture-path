import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-[color:var(--color-ink)]">404</h1>
        <h2 className="mt-4 font-display text-xl text-[color:var(--color-ink)]">Page not found.</h2>
        <p className="mt-2 text-sm text-[color:var(--color-ink-muted)]">That page doesn't exist.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[12px] bg-[color:var(--color-ink)] px-7 py-4 font-ui text-[13px] uppercase tracking-[0.14em] text-[color:var(--color-paper)]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#F5F0E6" },
      { title: "Lectio — A daily Bible reading habit" },
      { name: "description", content: "An honest tool for building a daily Bible reading habit." },
      { property: "og:title", content: "Lectio — A daily Bible reading habit" },
      { property: "og:description", content: "Read the Bible daily. Quietly track your progress. No streak shaming." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lectio.live" },
      { property: "og:image", content: "https://lectio.live/images/bread-illustration.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lectio — A daily Bible reading habit" },
      { name: "twitter:description", content: "Read the Bible daily. Quietly track your progress." },
      { name: "twitter:image", content: "https://lectio.live/images/bread-illustration.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/images/lectio-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "canonical", href: "https://lectio.live" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
