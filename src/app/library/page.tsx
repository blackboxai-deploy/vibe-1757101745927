"use client";

import { useState, useEffect } from "react";
import { VoiceProfileCard } from "@/components/VoiceProfile/VoiceProfileCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  audioUrl: string;
  quality: number;
}

export default function Library() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/voice/profiles");
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await fetch(`/api/voice/profiles/${id}`, { method: "DELETE" });
      setProfiles(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Voice Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage your voice profiles and samples
          </p>
        </div>
        <Button onClick={() => window.location.href = "/"}>
          Create New Voice
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-slate-500">No Voice Profiles Yet</CardTitle>
            <CardDescription>
              Start by creating your first voice profile on the main dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/"}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <VoiceProfileCard
              key={profile.id}
              profile={profile}
              onDelete={handleDeleteProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}