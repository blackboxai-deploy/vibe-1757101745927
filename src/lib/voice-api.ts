// API client functions for voice cloning operations

import { VoiceProfile, GenerationHistory, VoiceGenerationRequest, VoiceUploadRequest, ApiResponse } from './types';

const API_BASE_URL = '/api/voice';

// OpenRouter configuration for voice synthesis
export const VOICE_API_CONFIG = {
  endpoint: 'https://oi-server.onrender.com/chat/completions',
  headers: {
    'CustomerId': 'cus_SrncNq4xGqkmNq',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  },
  model: 'openrouter/elevenlabs/voice-synthesis'
};

export class VoiceAPI {
  static async uploadVoice(data: VoiceUploadRequest): Promise<ApiResponse<VoiceProfile>> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('audioFile', data.audioFile);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async generateVoice(data: VoiceGenerationRequest): Promise<ApiResponse<{ audioUrl: string; historyId: string }>> {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async getVoiceProfiles(): Promise<ApiResponse<VoiceProfile[]>> {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profiles: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteVoiceProfile(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete profile: ${response.statusText}`);
    }

    return response.json();
  }

  static async getGenerationHistory(): Promise<ApiResponse<GenerationHistory[]>> {
    const response = await fetch(`${API_BASE_URL}/history`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    return response.json();
  }

  // Direct API call to OpenRouter for voice synthesis
  static async synthesizeVoice(text: string, voiceSettings?: any): Promise<Blob> {
    const response = await fetch(VOICE_API_CONFIG.endpoint, {
      method: 'POST',
      headers: VOICE_API_CONFIG.headers,
      body: JSON.stringify({
        model: VOICE_API_CONFIG.model,
        messages: [
          {
            role: 'user',
            content: `Generate speech for the following text: "${text}"`
          }
        ],
        voice_settings: voiceSettings
      })
    });

    if (!response.ok) {
      throw new Error(`Voice synthesis failed: ${response.statusText}`);
    }

    return response.blob();
  }
}