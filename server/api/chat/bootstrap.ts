import { defineEventHandler } from "h3";

import type { AiChatBootstrapResponse } from "@/types/chat";
import { assertGetMethod, throwProxyError } from "@/server/utils/api";
import { buildAiApiUrl } from "./proxy";

export default defineEventHandler(async (event) => {
  assertGetMethod(event);

  try {
    return await $fetch<AiChatBootstrapResponse>(
      buildAiApiUrl("/ai/chat/bootstrap"),
    );
  } catch (error) {
    throwProxyError(error, "Failed to fetch AI chat bootstrap information");
  }
});
