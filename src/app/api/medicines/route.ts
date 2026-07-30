import { NextResponse } from "next/server";
import { medicines } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let result = [...medicines];

  if (id) {
    result = result.filter((m) => m.id === id);
  }
  if (slug) {
    result = result.filter((m) => m.slug === slug);
  }
  if (category) {
    result = result.filter((m) =>
      m.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  if (search) {
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.genericName?.toLowerCase().includes(search.toLowerCase()) ||
        m.manufacturer?.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = result.length;
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
