import { NextResponse } from "next/server";
import {
  getChatResponse,
  clearContext,
  analyzeSymptoms,
  getConversationHistory,
  replaceLastAssistantMessage,
} from "@/lib/chatbot";
import { generateAIReply, isAIEnabled } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { message, chatId, action, userProfile } = await request.json();
    if (action === "analyzeSymptoms") {
      const result = await analyzeSymptoms(message);
      return NextResponse.json(result);
    }
    if (!message || typeof message !== "string" || message.length > 2000) {
      return NextResponse.json({ error: "Message is required (max 2000 characters)" }, { status: 400 });
    }
    if (chatId !== undefined && (typeof chatId !== "string" || !/^[A-Za-z0-9-]{8,64}$/.test(chatId))) {
      return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
    }
    const id = chatId || "default";
    const response = await getChatResponse(message, id, userProfile);

    if (isAIEnabled()) {
      // History already contains this turn (user + rule-based reply); drop it.
      const history = getConversationHistory(id).slice(0, -2);
      const aiText = await generateAIReply({ message, history, rule: response, profile: userProfile });
      if (aiText) {
        replaceLastAssistantMessage(id, aiText);
        return NextResponse.json({ ...response, message: aiText, source: "ai" });
      }
    }

    return NextResponse.json({ ...response, source: "rules" });
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
