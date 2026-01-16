export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

export type AskRequest = {
  messages: ChatMessage[];
};

export type AskResponse = {
  reply: string;
};
