"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  audioUrl: string;
  quality: number;
}

interface VoiceProfileCardProps {
  profile: VoiceProfile;
  onDelete: (id: string) => void;
}

export function VoiceProfileCard({ profile, onDelete }: VoiceProfileCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(profile.id);
    } catch (error) {
      console.error("Failed to delete profile:", error);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 85) return "bg-green-100 text-green-800";
    if (quality >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 85) return "Excellent";
    if (quality >= 70) return "Good";
    return "Fair";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{profile.name}</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Created {formatDate(profile.createdAt)}
            </p>
          </div>
          <Badge className={getQualityColor(profile.quality)}>
            {getQualityLabel(profile.quality)} ({profile.quality}%)
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {profile.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {profile.description}
          </p>
        )}
        
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Voice Sample:
          </p>
          <AudioPlayer src={profile.audioUrl} />
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              // Navigate to main page with this profile selected
              window.location.href = `/?profile=${profile.id}`;
            }}
          >
            Use Voice
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isDeleting}>
                {isDeleting ? "..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Voice Profile</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{profile.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}