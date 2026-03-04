export type Role = 'user' | 'model' | 'system';

export type MessageType = 'text' | 'image' | 'audio' | 'error';

export interface Message {
  id: string;
  role: Role;
  content: string;
  type: MessageType;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  systemPrompt?: string;
}

export interface Settings {
  openRouterApiKey: string;
  defaultModel: string;
  isDarkMode: boolean;
  systemPrompt: string;
}

export interface UserData {
  fullName: string;
  email: string;
  password?: string;
}
