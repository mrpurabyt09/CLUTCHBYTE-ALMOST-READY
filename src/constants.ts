import { Settings } from './types';

export const MODELS = [
  { 
    id: 'deepseek/deepseek-r1', 
    name: 'DeepSeek R1', 
    provider: 'openrouter',
    description: 'Advanced reasoning model optimized for complex logic and creative problem solving.',
    status: 'Operational',
    latency: '~800ms',
    tokenUsage: '128k context'
  },
  { 
    id: 'deepseek/deepseek-chat', 
    name: 'DeepSeek V3', 
    provider: 'openrouter',
    description: 'Fast and efficient chat model for general-purpose conversational AI tasks.',
    status: 'Operational',
    latency: '~400ms',
    tokenUsage: '64k context'
  },
  { 
    id: 'gemini-3.1-flash-lite-preview', 
    name: 'Gemini Flash Lite', 
    provider: 'gemini',
    description: 'Extremely fast and lightweight model for quick responses and simple tasks.',
    status: 'Operational',
    latency: '~200ms',
    tokenUsage: '32k context'
  },
  { 
    id: 'gemini-3.1-pro-preview', 
    name: 'Gemini Pro', 
    provider: 'gemini',
    description: 'Highly capable model with advanced thinking and reasoning capabilities.',
    status: 'Operational',
    latency: '~1.2s',
    tokenUsage: '2M context'
  },
  { 
    id: 'gemini-3.1-pro-preview-vision', 
    name: 'Gemini Vision', 
    provider: 'gemini',
    description: 'Multimodal model specialized in analyzing and understanding images.',
    status: 'Operational',
    latency: '~1.5s',
    tokenUsage: '1M context'
  },
  { 
    id: 'gemini-3.1-flash-image-preview', 
    name: 'Gemini Image Gen', 
    provider: 'gemini',
    description: 'High-quality image generation model capable of creating detailed visuals.',
    status: 'Operational',
    latency: '~3.0s',
    tokenUsage: 'N/A'
  },
  { 
    id: 'gemini-2.5-flash-preview-tts', 
    name: 'Gemini TTS', 
    provider: 'gemini',
    description: 'Text-to-speech model for generating natural-sounding voice audio.',
    status: 'Operational',
    latency: '~500ms',
    tokenUsage: 'N/A'
  },
  { 
    id: 'gemini-2.5-flash-native-audio-preview-09-2025', 
    name: 'Gemini Live Audio', 
    provider: 'gemini',
    description: 'Real-time native audio model for low-latency voice interactions.',
    status: 'Degraded',
    latency: '~300ms',
    tokenUsage: 'N/A'
  },
];

export const DEFAULT_SETTINGS: Settings = {
  openRouterApiKey: '',
  defaultModel: 'gemini-3.1-flash-lite-preview',
  isDarkMode: false,
  systemPrompt: '',
};
