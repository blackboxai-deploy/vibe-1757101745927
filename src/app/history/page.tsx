"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";

interface GenerationHistory {
  id: string;
  text: string;
  voiceProfileName: string;
  audioUrl: string;
  createdAt: string;
  duration: number;
  status: "completed" | "processing" | "failed";
}

export default function History() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/voice/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAudio = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download audio:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-slate-200 rounded mb-4"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Generation History
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          View and replay your previous voice generations
        </p>
      </div>

      {history.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-slate-500">No Generation History</CardTitle>
            <CardDescription>
              Your voice generation history will appear here once you start creating audio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/"}>
              Generate Your First Voice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.voiceProfileName}</CardTitle>
                    <CardDescription className="text-sm">
                      Generated on {formatDate(item.createdAt)} • {item.duration}s
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "{item.text}"
                    </p>
                  </div>
                  
                  {item.status === "completed" && (
                    <div className="flex items-center justify-between">
                      <AudioPlayer src={item.audioUrl} />
                      <Button
                        variant="outline"
                        onClick={() => downloadAudio(item.audioUrl, `voice-generation-${item.id}.mp3`)}
                      >
                        Download
                      </Button>
                    </div>
                  )}
                  
                  {item.status === "processing" && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                      Processing audio...
                    </div>
                  )}
                  
                  {item.status === "failed" && (
                    <div className="text-sm text-red-600">
                      Generation failed. Please try again.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}