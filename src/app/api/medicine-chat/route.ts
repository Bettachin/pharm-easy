import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const res = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a helpful pharmacist assistant. 
Respond ONLY with clean, short sentences.
Explain the following medicine clearly:

"${message}" 

Format your reply like this:
**Used for:** …
**Dosage:** …
**Side effects:** …`,
        }),
      }
    );

    if (!res.ok) {
      console.error("Hugging Face API error:", await res.text());
      return NextResponse.json({ error: "Hugging Face API error" }, { status: 500 });
    }

    const data = await res.json();
    const text =
      data?.[0]?.generated_text?.replace(/https?:\/\/\S+/g, "").trim() ||
      "I'm sorry, I don’t have an answer for that.";

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
