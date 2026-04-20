import { NextRequest, NextResponse } from "next/server";

// GET /api/geocode?address=Rua+das+Ondas,+123,+Pitangueiras,+Guarujá
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });

  const fullAddress = address.includes("Guarujá") ? address : `${address}, Guarujá, SP, Brasil`;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=3&countrycodes=br`,
      {
        headers: {
          // Nominatim requires a descriptive User-Agent
          "User-Agent": "GuarujaGuias/1.0 (contato@guarujaguias.com.br)",
          "Accept-Language": "pt-BR",
        },
      }
    );

    const data = await res.json();

    if (!data.length) {
      return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      results: data.map((r: any) => ({
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        displayName: r.display_name,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
