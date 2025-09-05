"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { ProcessingStatus } from "./ProcessingStatus";

interface TextToSpeechProps {
  voiceProfileId: string | null;
}

export function TextToSpeech({ voiceProfileId }: TextToSpeechProps) {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState("");

  const handleGenerate = async () => {
    if (!text.trim() || !voiceProfileId) return;

    setIsGenerating(true);
    setProcessingStep("Initializing speech generation...");

    try {
      setProcessingStep("Processing text...");
      
      const response = await fetch("/api/voice/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          voiceProfileId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      setProcessingStep("Generating audio...");
      
      const data = await response.json();
      
      if (data.audioUrl) {
        setGeneratedAudio(data.audioUrl);
        setProcessingStep("Audio generated successfully!");
        
        setTimeout(() => {
          setIsGenerating(false);
          setProcessingStep("");
        }, 1000);
      } else {
        throw new Error("No audio URL returned");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setProcessingStep("Generation failed. Please try again.");
      setTimeout(() => {
        setIsGenerating(false);
        setProcessingStep("");
      }, 2000);
    }
  };

  const downloadAudio = async () => {
    if (!generatedAudio) return;

    try {
      const response = await fetch(generatedAudio);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `voice-generation-${Date.now()}.mp3`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const exampleTexts = [
    "Hello, this is a test of my cloned voice. How does it sound?",
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
    "I'm excited to try out this voice cloning technology. It's amazing what AI can do these days.",
    "Welcome to our AI voice cloning demo. Please enjoy exploring the capabilities of this technology."
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Enter text to generate speech:
        </label>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text you want to convert to speech..."
          className="min-h-[120px] resize-none"
          maxLength={1000}
        />
        
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>{text.length}/1000 characters</span>
          <span>Recommended: 50-200 characters for best quality</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Quick examples:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="p-3 text-left text-sm bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
            >
              "{example.substring(0, 50)}..."
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={!text.trim() || isGenerating}
          className="flex-1"
        >
          {isGenerating ? "Generating..." : "Generate Speech"}
        </Button>
        
        {generatedAudio && (
          <Button variant="outline" onClick={downloadAudio}>
            Download
          </Button>
        )}
      </div>

      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <ProcessingStatus step={processingStep} />
          </CardContent>
        </Card>
      )}

      {generatedAudio && !isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Generated Audio
                </h4>
                <div className="text-sm text-slate-500">
                  {text.length} characters
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                  "{text}"
                </p>
              </div>
              
              <AudioPlayer src={generatedAudio} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}