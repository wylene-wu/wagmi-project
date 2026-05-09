import type { Ref } from "vue";

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
}

let toastId = 0;

const createToast = (
  toasts: Ref<ToastItem[]>,
  type: ToastType,
  title: string,
  options: { message?: string; duration?: number } = {},
) => {
  const id = ++toastId;
  const duration = options.duration ?? (type === "loading" ? 0 : 3500);

  toasts.value = [
    ...toasts.value,
    {
      id,
      type,
      title,
      message: options.message,
      duration,
    },
  ];

  if (duration > 0) {
    globalThis.setTimeout(() => {
      removeToast(toasts, id);
    }, duration);
  }

  return id;
};

const removeToast = (toasts: Ref<ToastItem[]>, id: number) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

const clearToasts = (toasts: Ref<ToastItem[]>) => {
  toasts.value = [];
};

export const useToast = () => {
  const toasts = useState<ToastItem[]>("toasts", () => []);

  return {
    toasts,
    remove: (id: number) => removeToast(toasts, id),
    clear: () => clearToasts(toasts),
    success: (
      title: string,
      options?: { message?: string; duration?: number },
    ) => createToast(toasts, "success", title, options),
    error: (title: string, options?: { message?: string; duration?: number }) =>
      createToast(toasts, "error", title, options),
    info: (title: string, options?: { message?: string; duration?: number }) =>
      createToast(toasts, "info", title, options),
    loading: (
      title: string,
      options?: { message?: string; duration?: number },
    ) => createToast(toasts, "loading", title, options),
  };
};
