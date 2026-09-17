// Current temperature in Calgary from Open-Meteo (free, no API key). The CDN cache header keeps
// this to one upstream call every ten minutes however many people view the footer.
export const dynamic = "force-dynamic";

export type WeatherPayload = { tempC: number; observedAt: string };

const SOURCE =
  "https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&current=temperature_2m&timezone=America%2FEdmonton";

export async function GET() {
  try {
    const res = await fetch(SOURCE, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
    const data = (await res.json()) as { current?: { time?: string; temperature_2m?: number } };
    const temp = data.current?.temperature_2m;
    if (typeof temp !== "number") throw new Error("No temperature in response");

    const body: WeatherPayload = { tempC: Math.round(temp), observedAt: data.current?.time ?? "" };
    return Response.json(body, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" },
    });
  } catch {
    return Response.json({ error: "Weather unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
