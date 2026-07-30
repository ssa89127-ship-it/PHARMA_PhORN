import { NextResponse } from "next/server";
import { pharmacies } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const city = searchParams.get("city");
  const search = searchParams.get("search");

  let result = [...pharmacies];

  if (id) {
    result = result.filter((p) => p.id === id);
  }
  if (city) {
    result = result.filter((p) =>
      p.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  if (search) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase())
    );
  }

  return NextResponse.json({
    success: true,
    data: result.slice(0, 50),
    total: result.length,
  });
}
