// Audio processing utilities

export class AudioProcessor {
  static async getAudioDuration(file: File): Promise<number> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      // Server-side fallback - estimate duration based on file size and quality
      return Math.max(30, Math.min(file.size / (32 * 1024), 300)); // Rough estimate
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio file'));
      };
      
      audio.src = url;
    });
  }

  static async validateAudioFile(file: File): Promise<{ isValid: boolean; error?: string }> {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    const minDuration = 10; // 10 seconds
    const maxDuration = 300; // 5 minutes

    if (!validTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Please upload WAV, MP3, or OGG files.' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size too large. Maximum size is 50MB.' };
    }

    try {
      const duration = await this.getAudioDuration(file);
      
      if (duration < minDuration) {
        return { isValid: false, error: `Audio too short. Minimum duration is ${minDuration} seconds.` };
      }
      
      if (duration > maxDuration) {
        return { isValid: false, error: `Audio too long. Maximum duration is ${maxDuration} seconds.` };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Failed to process audio file.' };
    }
  }

  static formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  static async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static createAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  static async analyzeAudio(file: File): Promise<{ 
    sampleRate: number; 
    channels: number; 
    bitRate?: number;
    quality: 'low' | 'medium' | 'high';
  }> {
    // Server-side fallback
    if (typeof window === 'undefined') {
      // Estimate quality based on file size and name
      const quality: 'low' | 'medium' | 'high' = file.size > 5 * 1024 * 1024 ? 'high' : 
                                                  file.size > 1 * 1024 * 1024 ? 'medium' : 'low';
      return {
        sampleRate: 44100,
        channels: 2,
        quality
      };
    }

    try {
      const audioContext = this.createAudioContext();
      if (!audioContext) {
        throw new Error('AudioContext not available');
      }

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const sampleRate = audioBuffer.sampleRate;
      const channels = audioBuffer.numberOfChannels;
      const bitRate = Math.round((file.size * 8) / audioBuffer.duration);
      
      let quality: 'low' | 'medium' | 'high' = 'medium';
      
      if (sampleRate >= 44100 && bitRate >= 320000) {
        quality = 'high';
      } else if (sampleRate >= 22050 && bitRate >= 128000) {
        quality = 'medium';
      } else {
        quality = 'low';
      }

      audioContext.close();
      
      return { sampleRate, channels, bitRate, quality };
    } catch (error) {
      // Fallback analysis
      return {
        sampleRate: 44100,
        channels: 2,
        quality: 'medium'
      };
    }
  }
}