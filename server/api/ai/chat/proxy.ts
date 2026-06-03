export const getAiApiBaseUrl = (): string => {
  const config = useRuntimeConfig();
  return String(config.AiApiBaseUrl).replace(/\/$/, "");
};

export const buildAiApiUrl = (path: string): string =>
  `${getAiApiBaseUrl()}${path}`;
