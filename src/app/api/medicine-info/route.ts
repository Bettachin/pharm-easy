import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { medicine } = await req.json();

    const res = await fetch(
      `https://api-inference.huggingface.co/models/gpt2`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Give a short medical guide for ${medicine}. Include usage and common side effects.`,
        }),
      }
    );

    // ✅ Check if the request succeeded
    if (!res.ok) {
      const text = await res.text(); // read raw text so we can log it
      console.error("Hugging Face API error:", res.status, text);
      return NextResponse.json(
        { info: "⚠️ AI service unavailable. Please try again later." },
        { status: 500 }
      );
    }

    const data = await res.json();
    const text =
      typeof data[0]?.generated_text === "string"
        ? data[0].generated_text
        : "⚠️ No info available.";

    return NextResponse.json({ info: text });
  } catch (err) {
    console.error("Medicine info route error:", err);
    return NextResponse.json(
      { info: "⚠️ Unable to fetch medicine info." },
      { status: 500 }
    );
  }
}
