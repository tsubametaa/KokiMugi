import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint untuk Docker HEALTHCHECK dan Cloud Run liveness probe.
 * Mengembalikan status 200 jika aplikasi berjalan normal.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "kokimugi",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200 }
  );
}
