import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// POST /api/mercadopago/webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;

    const { type, data } = body;

    // Handle subscription (preapproval) events
    if (type === "subscription_preapproval") {
      const subId = data.id;

      const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${subId}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      });
      const sub = await mpRes.json();

      await convex.mutation(api.payments.handleSubscriptionUpdate, {
        mpSubscriptionId: subId,
        mpStatus: sub.status,
        nextBillingDate: sub.auto_recurring?.next_payment_date
          ? new Date(sub.auto_recurring.next_payment_date).getTime()
          : undefined,
        externalReference: sub.external_reference ?? "",
      });
    }

    // Handle payment events
    if (type === "payment") {
      const paymentId = data.id;

      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      });
      const payment = await mpRes.json();

      await convex.mutation(api.payments.recordPayment, {
        mpPaymentId: String(paymentId),
        mpSubscriptionId: payment.metadata?.preapproval_id ?? "",
        amount: payment.transaction_amount,
        status: payment.status,
        paidAt: payment.status === "approved" ? Date.now() : undefined,
      });
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
