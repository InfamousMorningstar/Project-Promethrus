import { ImageResponse } from "next/og";

export const alt = "AHMXD Technologies: Calgary web development and IT systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 80% 30%, rgba(124,58,237,0.35), #09090b 55%)",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 100 100">
            <path d="M50 5 L54 20 L52 85 L50 95 L48 85 L46 20 Z" fill="#8B5CF6" />
            <path d="M42 30 L12 85 L38 75 L42 60 Z" fill="#ffffff" fillOpacity="0.9" />
            <path d="M58 30 L88 85 L62 75 L58 60 Z" fill="#ffffff" fillOpacity="0.9" />
          </svg>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>AHMXD Technologies</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Websites built right.</div>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -4, lineHeight: 1.05, color: "#a78bfa" }}>
            Systems kept running.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a1a1aa" }}>
            Web development and IT systems for small businesses in Calgary
          </div>
        </div>
      </div>
    ),
    size,
  );
}
