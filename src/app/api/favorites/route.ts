import { NextResponse, type NextRequest } from "next/server";
import { getTaxisByIds } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 100);

  const taxis = await getTaxisByIds(ids);
  return NextResponse.json({ taxis });
}
