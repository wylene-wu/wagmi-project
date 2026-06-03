import { Readable } from "node:stream";
import {
  createError,
  defineEventHandler,
  getQuery,
  sendStream,
  setHeader,
} from "h3";

import { assertGetMethod, throwProxyError } from "@/server/utils/api";
import { buildAiApiUrl } from "./proxy";

export default defineEventHandler(async (event) => {
  assertGetMethod(event);

  const upstreamUrl = new URL(buildAiApiUrl("/ai/chat/stream"));
  const message = String(getQuery(event).message ?? "");
  upstreamUrl.searchParams.set("message", message);

  try {
    const response = await fetch(upstreamUrl);

    if (!response.ok || !response.body) {
      throw createError({
        statusCode: response.status || 502,
        statusMessage: "AI stream service unavailable",
      });
    }

    setHeader(event, "Content-Type", "text/event-stream; charset=utf-8");
    setHeader(event, "Cache-Control", "no-cache, no-transform");
    setHeader(event, "Connection", "keep-alive");
    setHeader(event, "X-Accel-Buffering", "no");

    return sendStream(event, Readable.fromWeb(response.body));
  } catch (error) {
    throwProxyError(error, "Failed to stream AI chat answer");
  }
});
