import { NextResponse } from 'next/server';

// Mock storage - in production, use a proper database
const voiceProfiles: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: voiceProfiles,
    message: 'Voice profiles retrieved successfully'
  });
}

// For demo purposes, add some sample profiles
export async function POST() {
  const sampleProfiles = [
    {
      id: 'voice_sample_1',
      name: 'Professional Speaker',
      description: 'Clear, authoritative voice perfect for presentations',
      audioUrl: 'https://placehold.co/400x200?text=Professional+Speaker+Voice+Sample',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      duration: 45.3,
      quality: 'high' as const,
      sampleRate: 44100,
      channels: 2
    },
    {
      id: 'voice_sample_2',
      name: 'Friendly Narrator',
      description: 'Warm, engaging voice ideal for storytelling',
      audioUrl: 'https://placehold.co/400x200?text=Friendly+Narrator+Voice+Sample',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      duration: 62.1,
      quality: 'high' as const,
      sampleRate: 44100,
      channels: 2
    },
    {
      id: 'voice_sample_3',
      name: 'Casual Conversational',
      description: 'Natural, conversational tone for everyday content',
      audioUrl: 'https://placehold.co/400x200?text=Casual+Conversational+Voice+Sample',
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      duration: 38.7,
      quality: 'medium' as const,
      sampleRate: 22050,
      channels: 1
    }
  ];

  // Add sample profiles if none exist
  if (voiceProfiles.length === 0) {
    voiceProfiles.push(...sampleProfiles);
  }

  return NextResponse.json({
    success: true,
    data: sampleProfiles,
    message: 'Sample profiles created'
  });
}