"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload/FileUpload";
import { TextToSpeech } from "./TextToSpeech";
import { ProcessingStatus } from "./ProcessingStatus";

export function VoiceCloner() {
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [voiceProfileId, setVoiceProfileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");

  const handleAudioUpload = async (file: File) => {
    setUploadedAudio(file);
    setIsProcessing(true);
    setProcessingStep("Uploading audio file...");

    try {
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("name", file.name.replace(/\.[^/.]+$/, ""));

      setProcessingStep("Processing voice sample...");
      
      const response = await fetch("/api/voice/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }

      const data = await response.json();
      setVoiceProfileId(data.profileId);
      setProcessingStep("Voice profile ready!");
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep("");
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setProcessingStep("Upload failed. Please try again.");
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep("");
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">1. Upload Voice Sample</TabsTrigger>
          <TabsTrigger value="generate" disabled={!voiceProfileId}>
            2. Generate Speech
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                Upload Voice Sample
              </CardTitle>
              <CardDescription>
                Upload a clear audio recording (30-60 seconds recommended) to create your voice profile.
                Supported formats: MP3, WAV, M4A
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <ProcessingStatus step={processingStep} />
              ) : (
                <FileUpload onFileUpload={handleAudioUpload} />
              )}
            </CardContent>
          </Card>

          {uploadedAudio && !isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Uploaded Sample</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{uploadedAudio.name}</p>
                    <p className="text-sm text-slate-500">
                      {(uploadedAudio.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="text-green-600 font-medium">
                    ✓ Ready
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                Generate Speech
              </CardTitle>
              <CardDescription>
                Enter text to generate speech using your cloned voice profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextToSpeech voiceProfileId={voiceProfileId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}