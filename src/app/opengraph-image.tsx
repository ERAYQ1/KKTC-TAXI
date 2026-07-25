import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = "KKTC Taksi | Kıbrıs'ta Hızlı Taksi Bulun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#fdf4f0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "#c2410c",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 48,
            }}
          >
            🚕
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#1c1917" }}>
            {SITE_NAME}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#1c1917",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Kıbrıs&apos;ta taksiye tek dokunuşla ulaşın
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            color: "#78716c",
          }}
        >
          Lefkoşa · Girne · Gazimağusa · İskele · Güzelyurt · Lefke
        </div>
      </div>
    ),
    { ...size },
  );
}
