<script setup lang="ts">
import type { ToastItem, ToastType } from "@/composables/useToast";

const { toasts, remove } = useToast();

const toastStyles: Record<
  ToastType,
  {
    label: string;
    dot: string;
    border: string;
    text: string;
    glow: string;
  }
> = {
  success: {
    label: "Success",
    dot: "bg-mint-text",
    border: "border-mint/35",
    text: "text-mint-text",
    glow: "shadow-[0_0_34px_color-mix(in_srgb,var(--color-mint)_14%,transparent)]",
  },
  error: {
    label: "Error",
    dot: "bg-danger",
    border: "border-danger/35",
    text: "text-danger",
    glow: "shadow-[0_0_34px_color-mix(in_srgb,var(--color-danger)_14%,transparent)]",
  },
  info: {
    label: "Info",
    dot: "bg-accent",
    border: "border-accent/30",
    text: "text-accent",
    glow: "shadow-[0_0_34px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]",
  },
  loading: {
    label: "Loading",
    dot: "bg-accent animate-pulse",
    border: "border-accent/30",
    text: "text-accent",
    glow: "shadow-[0_0_34px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]",
  },
};

const getToastStyle = (type: ToastType) => toastStyles[type];

const getProgressStyle = (toast: ToastItem) => {
  if (toast.duration <= 0) return undefined;

  return {
    animationDuration: `${toast.duration}ms`,
  };
};
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-stretch gap-3 sm:left-auto sm:right-5 sm:top-5 sm:w-[380px]"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0 scale-95"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100 scale-100"
        leave-to-class="translate-y-2 opacity-0 scale-95"
        move-class="transition-transform duration-200"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto relative overflow-hidden rounded-[22px] border bg-panel/90 p-4 text-white backdrop-blur-xl',
            'shadow-[0_20px_70px_rgba(0,0,0,0.34)]',
            getToastStyle(toast.type).border,
            getToastStyle(toast.type).glow,
          ]"
          role="status"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_38%),linear-gradient(135deg,color-mix(in_srgb,var(--color-surface)_76%,transparent),transparent_52%)]"
          />
          <div class="relative flex gap-3">
            <div
              :class="[
                'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                getToastStyle(toast.type).dot,
              ]"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p
                    :class="[
                      'text-xs font-semibold uppercase',
                      getToastStyle(toast.type).text,
                    ]"
                  >
                    {{ getToastStyle(toast.type).label }}
                  </p>
                  <p class="mt-1 text-sm font-semibold leading-5 text-white">
                    {{ toast.title }}
                  </p>
                </div>
                <button
                  type="button"
                  class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition duration-200 hover:border-accent/35 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Dismiss notification"
                  @click="remove(toast.id)"
                >
                  <span aria-hidden="true" class="text-lg leading-none">x</span>
                </button>
              </div>
              <p v-if="toast.message" class="mt-2 text-sm leading-6 text-muted">
                {{ toast.message }}
              </p>
            </div>
          </div>

          <div
            v-if="toast.duration > 0"
            class="absolute bottom-0 left-0 h-0.5 origin-left animate-[toast-progress_linear_forwards] bg-accent/70"
            :style="getProgressStyle(toast)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes toast-progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}
</style>
