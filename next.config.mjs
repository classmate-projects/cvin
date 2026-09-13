// Backend split, by environment:
//
// - Production (`next build` + `next start`, NODE_ENV=production): every
//   /api/* request is handled by the route handlers in src/app/api/**,
//   which talk to Supabase via src/lib/supabase.js. That's the only
//   backend production ever uses - nothing below applies to it.
//
// - Local development (`next dev`, NODE_ENV=development): the routes that
//   have an equivalent in the ASP.NET Core API (../cvin-api, backed by the
//   local "cvin" Postgres database - see cvin-api/appsettings.Development.json)
//   are rewritten straight there instead, so local dev exercises the real
//   Postgres + ASP.NET Core stack. cvin-api must be running locally
//   (`dotnet run` from cvin-api/, default http://localhost:5281) for these
//   to work; override the target with LOCAL_API_URL if it runs elsewhere.
//
// Routes with NO ASP.NET Core equivalent (email/sync's IMAP pull, analyze,
// status/ai's Gemini calls) are intentionally left out of this list, so
// they keep hitting their Next.js/Supabase implementation even in dev.
const isDev = process.env.NODE_ENV === "development";
const LOCAL_API_URL = process.env.LOCAL_API_URL || "http://localhost:5281";

const LOCAL_API_PATHS = [
  "/api/auth/:path*",
  "/api/users/:path*",
  "/api/resumes/:path*",
  "/api/upload",
  "/api/talent-pool",
  "/api/stats",
  "/api/config",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!isDev) return [];

    // beforeFiles is required here: it makes these rewrites win over the
    // matching src/app/api/** route handlers, which would otherwise be
    // matched first and shadow the proxy to cvin-api.
    return {
      beforeFiles: LOCAL_API_PATHS.map((source) => ({
        source,
        destination: `${LOCAL_API_URL}${source}`,
      })),
    };
  },
};

export default nextConfig;
