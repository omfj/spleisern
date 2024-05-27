import OpenAI from "openai";

export const getOpenAI = (apiKey: string) => {
  return new OpenAI({
    apiKey,
  });
};
