"use client";

import { useEffect, useState } from "react";

/** A chat id unique to this browser tab (kept in sessionStorage), so users never share a conversation. */
export function useChatId(scope = "chat"): string {
  const [id, setId] = useState("pending-chat-id");
  useEffect(() => {
    const key = `vitahub-${scope}-id`;
    let value: string | null = null;
    try {
      value = sessionStorage.getItem(key);
    } catch {}
    if (!value) {
      value =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      try {
        sessionStorage.setItem(key, value);
      } catch {}
    }
    setId(value);
  }, [scope]);
  return id;
}
