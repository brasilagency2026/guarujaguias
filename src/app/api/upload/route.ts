import { NextRequest, NextResponse } from "next/server";

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CF_API_TOKEN = process.env.CLOUDFLARE_IMAGES_TOKEN!;

// POST /api/upload — Upload image to Cloudflare Images
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const businessSlug = formData.get("businessSlug") as string;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Formato inválido. Use JPEG, PNG ou WebP" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Imagem muito grande. Máximo 10MB" }, { status: 400 });
    }

    const cfForm = new FormData();
    cfForm.append("file", file);
    cfForm.append("metadata", JSON.stringify({
      businessSlug,
      type,
      uploadedAt: new Date().toISOString(),
    }));

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        body: cfForm,
      }
    );

    const cfData = await cfRes.json();

    if (!cfData.success) {
      return NextResponse.json({ error: cfData.errors }, { status: 400 });
    }

    const imageId = cfData.result.id;
    const hash = process.env.NEXT_PUBLIC_CF_IMAGES_HASH;

    return NextResponse.json({
      imageId,
      urls: {
        thumbnail: `https://imagedelivery.net/${hash}/${imageId}/thumbnail`,
        card:      `https://imagedelivery.net/${hash}/${imageId}/card`,
        hero:      `https://imagedelivery.net/${hash}/${imageId}/hero`,
        original:  `https://imagedelivery.net/${hash}/${imageId}/public`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/upload?imageId=xxx
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");

  if (!imageId) return NextResponse.json({ error: "No imageId" }, { status: 400 });

  const cfRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${imageId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    }
  );

  const data = await cfRes.json();
  return NextResponse.json({ success: data.success });
}
