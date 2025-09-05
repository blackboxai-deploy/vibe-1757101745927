"use client";

import { VoiceCloner } from "@/components/VoiceCloner/VoiceCloner";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          AI Voice Cloner
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Clone voices with advanced AI technology. Upload a voice sample and generate 
          natural-sounding speech from any text.
        </p>
      </div>
      
      <VoiceCloner />
    </div>
  );
}