export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: number;
  role: ChatRole;
  content: string;
  time: string;
  streaming?: boolean;
};

export type PredictionMetric = {
  label: string;
  value: string;
  tone: "accent" | "mint" | "soft";
};
