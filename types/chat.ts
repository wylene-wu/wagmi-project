export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: number;
  role: ChatRole;
  content: string;
  time: string;
  streaming?: boolean;
};

export type AiChatMessagesResponse = {
  messages: ChatMessage[];
};

export type AiChatStreamTokenEvent = {
  token: string;
};

export type ChatContextItem = {
  label: string;
  value: string;
};

export type PredictionMetric = {
  label: string;
  value: string;
  tone: "accent" | "mint" | "soft";
};

export type AiChatBootstrapResponse = {
  longContextItems: ChatContextItem[];
  predictionMetrics: PredictionMetric[];
  quickPrompts: string[];
};
