import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { Message, Settings } from "../types";
import { puter } from '@heyputer/puter.js';

export async function* streamGroq(messages: Message[], settings: Settings, model: string) {
  const groqMessages = messages.map(m => ({
    role: m.role === 'model' ? 'assistant' : m.role,
    content: m.content
  }));

  if (settings.systemPrompt) {
    groqMessages.unshift({ role: 'system', content: settings.systemPrompt });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${settings.groqApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: groqMessages,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API Error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");
  
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim() === "") continue;
      if (line.trim() === "data: [DONE]") return;
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.choices?.[0]?.delta?.content) {
            yield data.choices[0].delta.content;
          }
        } catch (e) {
          console.error("Error parsing Groq chunk", e);
        }
      }
    }
  }
}

export async function* streamPuter(messages: Message[], settings: Settings, model: string) {
  const lastMessage = messages[messages.length - 1].content;
  
  const response = await puter.ai.chat(lastMessage, {
    model: model,
    stream: true
  });
  
  for await (const part of response) {
    yield part?.text || "";
  }
}

export async function* streamOpenRouter(messages: Message[], settings: Settings, model: string) {
  const openRouterMessages = messages.map(m => ({
    role: m.role === 'model' ? 'assistant' : m.role,
    content: m.content
  }));

  if (settings.systemPrompt) {
    openRouterMessages.unshift({ role: 'system', content: settings.systemPrompt });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${settings.openRouterApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: openRouterMessages.map(m => ({ role: m.role, content: m.content })),
      stream: true
    })
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData.error && errorData.error.message) {
        errorMsg = errorData.error.message;
      }
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(`OpenRouter API Error: ${errorMsg}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");
  
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim() === "") continue;
      if (line.trim() === "data: [DONE]") return;
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.choices?.[0]?.delta?.content) {
            yield data.choices[0].delta.content;
          }
        } catch (e) {
          console.error("Error parsing OpenRouter chunk", e);
        }
      }
    }
  }
}

export async function* streamGemini(messages: Message[], settings: Settings, model: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const contents = messages.map(m => {
    const parts: any[] = [];
    if (m.type === 'text') {
      parts.push({ text: m.content });
    } else if (m.type === 'image') {
      const [prefix, base64] = m.content.split(',');
      const mimeType = prefix.match(/:(.*?);/)?.[1] || 'image/png';
      parts.push({
        inlineData: {
          data: base64,
          mimeType: mimeType
        }
      });
    }
    return {
      role: m.role === 'user' ? 'user' : 'model',
      parts: parts
    };
  });

  const config: any = {};
  if (settings.systemPrompt) {
    config.systemInstruction = settings.systemPrompt;
  }

  if (model === 'gemini-3.1-pro-preview') {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
  }

  const actualModel = model === 'gemini-3.1-pro-preview-vision' ? 'gemini-3.1-pro-preview' : model;

  const responseStream = await ai.models.generateContentStream({
    model: actualModel,
    contents: contents,
    config
  });

  for await (const chunk of responseStream) {
    yield chunk.text;
  }
}

export async function generateImage(prompt: string, size: string) {
  if (!(await (window as any).aistudio?.hasSelectedApiKey?.())) {
    await (window as any).aistudio?.openSelectKey?.();
  }
  
  const localAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await localAi.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size as any
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function generateSpeech(text: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    return `data:audio/mp3;base64,${base64Audio}`;
  }
  throw new Error("No audio generated");
}
