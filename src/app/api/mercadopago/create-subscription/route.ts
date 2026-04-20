import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// POST /api/mercadopago/create-subscription
export async function POST(req: NextRequest) {
  try {
    const { businessId, ownerEmail, ownerName } = await req.json();

    const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

    // Create MercadoPago preapproval (subscription)
    const mpResponse = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Guarujá Guias – Plano Pro (Mini-Site)",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 50,
          currency_id: "BRL",
        },
        payer_email: ownerEmail,
        back_url: `${APP_URL}/dashboard/subscription/success?businessId=${businessId}`,
        notification_url: `${APP_URL}/api/mercadopago/webhook`,
        status: "pending",
        // External reference to link back to our system
        external_reference: `business_${businessId}`,
      }),
    });

    if (!mpResponse.ok) {
      const err = await mpResponse.json();
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const data = await mpResponse.json();

    return NextResponse.json({
      subscriptionId: data.id,
      initPoint: data.init_point,  // Redirect user here to confirm subscription
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
