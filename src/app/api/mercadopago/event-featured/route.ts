import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { eventId, eventTitle } = await req.json();
    const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: `Destaque de Evento — ${eventTitle}`,
            description: "Destaque na homepage do Guarujá Guias por 30 dias",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 100,
          },
        ],
        back_urls: {
          success: `${APP_URL}/dashboard/eventos?featured=success&eventId=${eventId}`,
          failure: `${APP_URL}/dashboard/eventos?featured=error`,
          pending: `${APP_URL}/dashboard/eventos?featured=pending`,
        },
        auto_return: "approved",
        external_reference: `event_featured_${eventId}`,
        notification_url: `${APP_URL}/api/mercadopago/webhook`,
        statement_descriptor: "GUARUJA GUIAS",
      }),
    });

    const data = await mpRes.json();
    if (!mpRes.ok) return NextResponse.json({ error: data }, { status: 400 });

    return NextResponse.json({ initPoint: data.init_point });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
