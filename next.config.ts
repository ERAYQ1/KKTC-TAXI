import type { NextConfig } from "next";

/**
 * Allow images from whichever Supabase instance this deployment points at —
 * `*.supabase.co` for hosted projects, `127.0.0.1:54321` for `supabase start`.
 */
function supabaseImagePatterns(): NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> {
  const patterns: NonNullable<
    NonNullable<NextConfig["images"]>["remotePatterns"]
  > = [
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    try {
      const { protocol, hostname, port } = new URL(url);
      if (!hostname.endsWith(".supabase.co")) {
        patterns.push({
          protocol: protocol.replace(":", "") as "http" | "https",
          hostname,
          ...(port ? { port } : {}),
          pathname: "/storage/v1/object/public/**",
        });
      }
    } catch {
      // Malformed URL: fall back to the hosted pattern only.
    }
  }

  return patterns;
}

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImagePatterns(),
    // `supabase start` serves storage from 127.0.0.1, which Next 16 blocks by
    // default. Kept strictly to development so the guard stays on in production.
    ...(isDev ? { dangerouslyAllowLocalIP: true } : {}),
    // Only ever serves our own static placeholder asset (`/public`), never a
    // user-controlled or remote SVG — photo uploads are restricted to
    // JPG/PNG/WebP in `validation.ts`, so this can't become an XSS vector.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    serverActions: {
      // Photos are capped at 2 MB in validation; leave room for the
      // multipart boundaries and field metadata on top of that.
      bodySizeLimit: "3mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops a mislabelled upload from being sniffed and executed.
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), camera=(), microphone=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
