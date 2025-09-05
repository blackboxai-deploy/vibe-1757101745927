import { z } from "zod";

// Voice upload validation schema
export const voiceUploadSchema = z.object({
  name: z.string()
    .min(1, "Voice name is required")
    .max(50, "Voice name must be 50 characters or less")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Voice name can only contain letters, numbers, spaces, hyphens, and underscores"),
  
  description: z.string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
    
  audioFile: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, "File size must be less than 50MB")
    .refine((file) => {
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/m4a'];
      return validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a)$/i);
    }, "Must be a valid audio file (MP3, WAV, M4A)")
});

// Text to speech generation validation schema  
export const textToSpeechSchema = z.object({
  text: z.string()
    .min(1, "Text is required")
    .max(5000, "Text must be 5000 characters or less")
    .refine((text) => text.trim().length > 0, "Text cannot be empty"),
    
  voiceProfileId: z.string()
    .min(1, "Voice profile is required")
});

// Voice profile validation schema
export const voiceProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  audioUrl: z.string().url(),
  createdAt: z.string(),
  duration: z.number().positive(),
  quality: z.enum(['low', 'medium', 'high']),
  sampleRate: z.number().positive().optional(),
  channels: z.number().positive().optional()
});

// Generation history validation schema
export const generationHistorySchema = z.object({
  id: z.string(),
  voiceProfileId: z.string(),
  voiceProfileName: z.string(),
  text: z.string(),
  audioUrl: z.string().url(),
  createdAt: z.string(),
  duration: z.number().positive()
});

// API response validation schemas
export const apiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// Export types inferred from schemas
export type VoiceUploadInput = z.infer<typeof voiceUploadSchema>;
export type TextToSpeechInput = z.infer<typeof textToSpeechSchema>;
export type VoiceProfileData = z.infer<typeof voiceProfileSchema>;
export type GenerationHistoryData = z.infer<typeof generationHistorySchema>;
export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<T>>>;

// Validation helper functions
export const validateVoiceUpload = (data: unknown) => {
  return voiceUploadSchema.safeParse(data);
};

export const validateTextToSpeech = (data: unknown) => {
  return textToSpeechSchema.safeParse(data);
};

export const validateVoiceProfile = (data: unknown) => {
  return voiceProfileSchema.safeParse(data);
};

export const validateGenerationHistory = (data: unknown) => {
  return generationHistorySchema.safeParse(data);
};