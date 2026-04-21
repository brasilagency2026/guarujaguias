import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// MercadoPago webhook — receives payment/subscription events
http.route({
  path: "/mp-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json();
    const { type, data } = body;
    const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;

    if (type === "subscription_preapproval" && data?.id) {
      const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${data.id}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      });
      const sub = await mpRes.json();

      await ctx.runMutation(api.payments.handleSubscriptionUpdate, {
        mpSubscriptionId: sub.id,
        mpStatus: sub.status,
        nextBillingDate: sub.auto_recurring?.next_payment_date
          ? new Date(sub.auto_recurring.next_payment_date).getTime()
          : undefined,
        externalReference: sub.external_reference ?? "",
      });
    }

    if (type === "payment" && data?.id) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      });
      const payment = await mpRes.json();

      if (payment.metadata?.preapproval_id) {
        await ctx.runMutation(api.payments.recordPayment, {
          mpPaymentId: String(data.id),
          mpSubscriptionId: payment.metadata.preapproval_id,
          amount: payment.transaction_amount,
          status: payment.status,
          paidAt: payment.status === "approved" ? Date.now() : undefined,
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
