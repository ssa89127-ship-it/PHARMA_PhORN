import { NextResponse } from "next/server";
import { getChatResponse, clearContext, analyzeSymptoms } from "@/lib/chatbot";

export async function POST(request: Request) {
  try {
    const { message, chatId, action, userProfile } = await request.json();
    if (action === "analyzeSymptoms") {
      const result = await analyzeSymptoms(message);
      return NextResponse.json(result);
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    const response = await getChatResponse(message, chatId || "default", userProfile);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { chatId } = await request.json();
    clearContext(chatId || "default");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Chatbot clear error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
