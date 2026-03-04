import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { X, Mic, MicOff } from 'lucide-react';

export function LiveAudioModal({ onClose }: { onClose: () => void }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const startSession = async () => {
    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
        },
        callbacks: {
          onopen: async () => {
            setIsConnected(true);
            await startRecording(sessionPromise);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              playAudio(base64Audio);
            }
          },
          onerror: (e) => {
            console.error(e);
            setError("Connection error");
            setIsConnected(false);
          },
          onclose: () => {
            setIsConnected(false);
            setIsRecording(false);
          }
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      setError(e.message);
    }
  };

  const startRecording = async (sessionPromise: Promise<any>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = async (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const buffer = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < buffer.byteLength; i++) {
          binary += String.fromCharCode(buffer[i]);
        }
        const base64Data = btoa(binary);
        
        const session = await sessionPromise;
        session.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsRecording(true);
    } catch (e: any) {
      setError("Microphone access denied");
    }
  };

  const playAudio = async (base64Audio: string) => {
    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (e) {
      console.error("Error playing audio", e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm p-8 flex flex-col items-center relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full">
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-white mb-2">Live Audio</h2>
          <p className="text-zinc-400 text-sm">Have a real-time conversation with Gemini.</p>
        </div>
        
        <div className="relative mb-8">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isConnected ? 'bg-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.3)]' : 'bg-zinc-800'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isConnected ? 'bg-indigo-500 scale-110' : 'bg-zinc-700'}`}>
              {isConnected ? <Mic size={40} className="text-white" /> : <MicOff size={40} className="text-zinc-400" />}
            </div>
          </div>
          
          {isRecording && (
            <div className="absolute -inset-4 border-2 border-indigo-500/30 rounded-full animate-ping" />
          )}
        </div>
        
        {error && (
          <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
        )}
        
        <button 
          onClick={isConnected ? cleanup : startSession}
          className={`px-8 py-3 rounded-full font-medium transition-colors ${isConnected ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-white text-zinc-900 hover:bg-zinc-200'}`}
        >
          {isConnected ? 'End Conversation' : 'Start Conversation'}
        </button>
      </div>
    </div>
  );
}
