<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

import type {
  AiChatBootstrapResponse,
  AiChatMessagesResponse,
  AiChatStreamTokenEvent,
  ChatMessage,
  PredictionMetric,
} from "@/types/chat";
import { timeNowLabelFormat } from "@/utils/tool";

definePageMeta({
  layout: "default",
});

const { data: chatBootstrap } = useLazyFetch<AiChatBootstrapResponse>(
  "/api/ai/chat/bootstrap",
);
const { data: chatMessages } =
  useLazyFetch<AiChatMessagesResponse>("/api/ai/chat");

const chatBootstrapState = computed(() => ({
  longContextItems: chatBootstrap.value?.longContextItems ?? [],
  predictionMetrics: chatBootstrap.value?.predictionMetrics ?? [],
  quickPrompts: chatBootstrap.value?.quickPrompts ?? [],
}));
const messages = ref<ChatMessage[]>([]);
const hasLoadedInitialMessages = ref(false);

const chatInput = ref("");
const isStreaming = ref(false);
const messageListRef = ref<HTMLElement | null>(null);
let streamRunId = 0;
let stopActiveRenderer: (() => void) | undefined;

const STREAM_RENDER_INTERVAL_MS = 48;
const STREAM_RENDER_CHARS_PER_TICK = 2;

type StreamRenderer = {
  complete: () => Promise<void>;
  enqueue: (chunk: string) => void;
  stop: () => void;
};

const isSendDisabled = computed(
  () => chatInput.value.trim().length === 0 || isStreaming.value,
);

const predictionToneClass = (tone: PredictionMetric["tone"]): string => {
  if (tone === "mint") return "text-mint-text";
  if (tone === "accent") return "text-accent";
  return "text-soft";
};

const scrollToBottom = async (): Promise<void> => {
  await nextTick();
  if (!messageListRef.value) return;
  messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
};

const createStreamRenderer = (
  messageIndex: number,
  runId: number,
): StreamRenderer => {
  let buffer = "";
  let renderedContent = "";
  let sourceCompleted = false;
  let stopped = false;
  let renderTimer: ReturnType<typeof setTimeout> | undefined;
  let resolveComplete: (() => void) | undefined;

  const renderComplete = new Promise<void>((resolve) => {
    resolveComplete = resolve;
  });

  const finish = (): void => {
    if (renderTimer) {
      clearTimeout(renderTimer);
      renderTimer = undefined;
    }
    resolveComplete?.();
  };

  const scheduleRender = (): void => {
    if (renderTimer || stopped) return;
    renderTimer = setTimeout(renderNextChunk, STREAM_RENDER_INTERVAL_MS);
  };

  const renderNextChunk = (): void => {
    renderTimer = undefined;

    if (stopped || runId !== streamRunId) {
      stopped = true;
      finish();
      return;
    }

    if (buffer.length > 0) {
      const nextChunk = buffer.slice(0, STREAM_RENDER_CHARS_PER_TICK);
      buffer = buffer.slice(STREAM_RENDER_CHARS_PER_TICK);
      renderedContent = `${renderedContent}${nextChunk}`;

      const currentMessage = messages.value[messageIndex];
      if (!currentMessage) return;

      messages.value[messageIndex] = {
        ...currentMessage,
        content: renderedContent,
      };

      void scrollToBottom();
    }

    if (buffer.length > 0) {
      scheduleRender();
      return;
    }

    if (sourceCompleted) {
      finish();
    }
  };

  return {
    enqueue: (chunk: string): void => {
      if (!chunk || stopped) return;
      buffer = `${buffer}${chunk}`;
      scheduleRender();
    },
    complete: async (): Promise<void> => {
      sourceCompleted = true;
      if (buffer.length > 0) {
        scheduleRender();
        await renderComplete;
        return;
      }
      finish();
      await renderComplete;
    },
    stop: (): void => {
      stopped = true;
      finish();
    },
  };
};

const runAssistantStream = async (prompt: string): Promise<void> => {
  const runId = ++streamRunId;
  const assistantMessage: ChatMessage = {
    id: Date.now() + 1,
    role: "assistant",
    content: "",
    time: timeNowLabelFormat(),
    streaming: true,
  };

  messages.value.push(assistantMessage);
  const assistantMessageIndex = messages.value.length - 1;
  const renderer = createStreamRenderer(assistantMessageIndex, runId);
  stopActiveRenderer = renderer.stop;
  await scrollToBottom();

  await new Promise<void>((resolve) => {
    const streamUrl = new URL("/api/ai/chat/stream", window.location.origin);
    streamUrl.searchParams.set("message", prompt);

    const eventSource = new EventSource(streamUrl.toString());
    let settled = false;

    const finishStream = async (): Promise<void> => {
      if (settled) return;
      settled = true;
      eventSource.close();
      if (stopActiveRenderer === stopStream) {
        stopActiveRenderer = undefined;
      }
      await renderer.complete();
      resolve();
    };

    const failStream = async (): Promise<void> => {
      if (settled || runId !== streamRunId) return;
      renderer.enqueue(
        "The AI assistant service is unavailable right now. Please try again later.",
      );
      await finishStream();
    };

    const stopStream = (): void => {
      settled = true;
      eventSource.close();
      renderer.stop();
      resolve();
    };

    stopActiveRenderer = stopStream;

    eventSource.addEventListener("token", (event) => {
      if (runId !== streamRunId) return;

      try {
        const data = JSON.parse(event.data) as AiChatStreamTokenEvent;
        renderer.enqueue(data.token);
      } catch {
        failStream();
      }
    });

    eventSource.addEventListener("done", finishStream);
    eventSource.onerror = failStream;
  });

  if (runId === streamRunId) {
    const currentMessage = messages.value[assistantMessageIndex];
    if (!currentMessage) return;

    messages.value[assistantMessageIndex] = {
      ...currentMessage,
      streaming: false,
    };
  }
};

const handleSendMessage = async (prompt = chatInput.value): Promise<void> => {
  const content = prompt.trim();
  if (!content || isStreaming.value) return;

  messages.value.push({
    id: Date.now(),
    role: "user",
    content,
    time: timeNowLabelFormat(),
  });
  chatInput.value = "";
  isStreaming.value = true;

  try {
    await runAssistantStream(content);
  } finally {
    isStreaming.value = false;
  }
};

const handleNewChat = async (): Promise<void> => {
  streamRunId++;
  stopActiveRenderer?.();
  stopActiveRenderer = undefined;
  isStreaming.value = false;
  chatInput.value = "";

  const chatMessages = await $fetch<AiChatMessagesResponse>("/api/ai/chat", {
    query: {
      mode: "reset",
    },
  });
  messages.value = chatMessages.messages;
};

const handleStopStream = (): void => {
  streamRunId++;
  stopActiveRenderer?.();
  stopActiveRenderer = undefined;
  isStreaming.value = false;
};

onBeforeUnmount(() => {
  streamRunId++;
  stopActiveRenderer?.();
});

watch(
  chatMessages,
  (nextMessages) => {
    if (hasLoadedInitialMessages.value || !nextMessages?.messages) return;
    messages.value = nextMessages.messages;
    hasLoadedInitialMessages.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="relative flex min-h-[calc(100vh-9rem)] flex-col gap-6 overflow-hidden"
  >
    <div
      class="pointer-events-none absolute inset-x-8 top-8 h-48 rounded-full bg-accent/10 blur-3xl"
    />

    <section
      class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
          >
            AI workspace
          </span>
          <span
            class="rounded-full border border-mint/20 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint-text"
          >
            SSE streaming
          </span>
        </div>
        <h1 class="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl">
          AI ChatBot
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          Ask staking questions, inspect AI prediction context, and preview how
          backend streaming responses feel in the product.
        </p>
      </div>

      <button
        type="button"
        class="min-h-12 cursor-pointer rounded-2xl border border-accent/25 bg-accent/10 px-5 text-sm font-semibold text-accent transition duration-200 hover:border-accent/55 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        @click="handleNewChat"
      >
        New Chat
      </button>
    </section>

    <section
      class="relative grid flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div
        class="relative flex min-h-[680px] flex-col overflow-hidden rounded-[28px] border border-accent/20 bg-panel shadow-[0_28px_120px_rgba(0,0,0,0.42),0_0_52px_color-mix(in_srgb,var(--color-accent)_10%,transparent)]"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_32%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-mint)_8%,transparent),transparent_36%)]"
        />

        <div class="relative border-b border-white/10 px-5 py-4 sm:px-6">
          <p class="text-xs font-semibold uppercase text-subtle">
            Conversation
          </p>
          <h2 class="mt-1 text-xl font-bold text-white">Staking assistant</h2>
        </div>

        <div
          ref="messageListRef"
          class="relative flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6"
          aria-live="polite"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start',
            ]"
          >
            <div
              v-if="message.role === 'assistant'"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-mint/20 bg-mint/10 text-sm font-bold text-mint-text"
            >
              AI
            </div>

            <div
              :class="[
                'max-w-[min(720px,82%)] rounded-3xl border px-5 py-4 shadow-[0_14px_50px_rgba(0,0,0,0.18)]',
                message.role === 'user'
                  ? 'border-accent/25 bg-accent/10 text-right'
                  : 'border-white/10 bg-surface/85',
              ]"
            >
              <p class="whitespace-pre-wrap text-sm leading-7 text-soft">
                {{ message.content
                }}<span
                  v-if="message.streaming"
                  class="ml-1 inline-block h-4 w-2 animate-pulse rounded-sm bg-accent align-middle motion-reduce:animate-none"
                />
              </p>
              <p class="mt-3 text-xs text-subtle">{{ message.time }}</p>
            </div>
          </div>
        </div>

        <div class="relative border-t border-white/10 p-4 sm:p-5">
          <div class="mb-4 flex flex-wrap gap-2">
            <button
              v-for="prompt in chatBootstrapState.quickPrompts"
              :key="prompt"
              type="button"
              class="min-h-9 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-muted transition duration-200 hover:border-accent/35 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isStreaming"
              @click="handleSendMessage(prompt)"
            >
              {{ prompt }}
            </button>
          </div>

          <form
            class="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/90 p-2"
            @submit.prevent="handleSendMessage()"
          >
            <label class="sr-only" for="ai-chat-input">Message</label>
            <input
              id="ai-chat-input"
              v-model="chatInput"
              type="text"
              class="min-h-12 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-subtle"
              placeholder="Ask about staking rewards, risk, or safe next steps..."
              :disabled="isStreaming"
            />
            <button
              v-if="isStreaming"
              type="button"
              class="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 transition duration-200 hover:border-red-500/60 hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Stop response"
              @click="handleStopStream"
            >
              <svg
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="6" y="6" width="12" height="12" />
              </svg>
            </button>
            <button
              v-else
              type="submit"
              class="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent transition duration-200 hover:border-accent/55 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:border-accent/10 disabled:bg-accent/5 disabled:text-accent/30"
              :disabled="isSendDisabled"
              aria-label="Send message"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14m0 0l-6-6m6 6l-6 6"
                />
              </svg>
            </button>
          </form>

          <p class="mt-3 text-center text-xs text-subtle">
            AI responses may be inaccurate. Verify important staking and wallet
            information before acting.
          </p>
        </div>
      </div>

      <aside class="space-y-5">
        <section
          class="relative overflow-hidden rounded-3xl border border-mint/20 bg-panel p-5 shadow-[0_22px_80px_rgba(0,0,0,0.26)]"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-mint)_12%,transparent),transparent_38%)]"
          />
          <div class="relative">
            <p class="text-xs font-semibold uppercase text-subtle">
              AI Prediction
            </p>
            <h2 class="mt-2 text-xl font-bold text-white">Staking outlook</h2>
            <p class="mt-2 text-sm leading-6 text-muted">
              Backend-agent response for a 0.5 ETH stake simulation.
            </p>

            <div class="mt-5 space-y-3">
              <div
                v-for="metric in chatBootstrapState.predictionMetrics"
                :key="metric.label"
                class="rounded-2xl border border-white/10 bg-white/4 p-4"
              >
                <p class="text-xs font-semibold uppercase text-subtle">
                  {{ metric.label }}
                </p>
                <p
                  :class="[
                    'mt-2 text-lg font-bold',
                    predictionToneClass(metric.tone),
                  ]"
                >
                  {{ metric.value }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="mt-5 min-h-11 w-full rounded-2xl border border-accent/25 bg-accent/10 text-sm font-semibold text-accent transition duration-200 hover:border-accent/55 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              @click="handleSendMessage('Predict my staking rewards')"
            >
              Ask AI to explain
            </button>
          </div>
        </section>

        <section
          class="relative overflow-hidden rounded-3xl border border-accent/20 bg-surface/90 p-5 shadow-[0_22px_80px_rgba(0,0,0,0.24)]"
        >
          <p class="text-xs font-semibold uppercase text-subtle">
            Long context preview
          </p>
          <h2 class="mt-2 text-xl font-bold text-white">Context sent to AI</h2>
          <div class="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">
            <div
              v-for="item in chatBootstrapState.longContextItems"
              :key="item.label"
              class="rounded-2xl border border-white/10 bg-white/4 p-4"
            >
              <p class="text-sm font-semibold text-accent">{{ item.label }}</p>
              <p class="mt-2 text-xs leading-5 text-muted">{{ item.value }}</p>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </div>
</template>
