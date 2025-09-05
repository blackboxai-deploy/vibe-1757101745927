// Core types for the AI Voice Cloner application

export interface VoiceProfile {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  createdAt: string;
  duration: number;
  quality: 'low' | 'medium' | 'high';
}

export interface GenerationHistory {
  id: string;
  voiceProfileId: string;
  voiceProfileName: string;
  text: string;
  audioUrl: string;
  createdAt: string;
  duration: number;
}

export interface VoiceGenerationRequest {
  voiceProfileId: string;
  text: string;
}

export interface VoiceUploadRequest {
  name: string;
  description?: string;
  audioFile: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'processing' | 'generating' | 'completed' | 'error';
  progress: number;
  message: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}