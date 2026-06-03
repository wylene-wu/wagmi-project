import { defineEventHandler, getQuery } from "h3";

import { assertGetMethod, throwProxyError } from "@/server/utils/api";
import { buildAiApiUrl } from "./proxy";
import { AiChatMessagesResponse } from "@/types/chat";

export default defineEventHandler(async (event) => {
  assertGetMethod(event);

  try {
    return await $fetch<AiChatMessagesResponse>(buildAiApiUrl("/ai/chat"), {
      query: getQuery(event),
    });
  } catch (error) {
    throwProxyError(error, "Failed to fetch AI chat messages information");
  }
});
