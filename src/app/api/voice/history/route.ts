import { NextResponse } from 'next/server';

// Mock storage - in production, use a proper database
const generationHistory: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: generationHistory,
    message: 'Generation history retrieved successfully'
  });
}

// For demo purposes, add some sample history
export async function POST() {
  const sampleHistory = [
    {
      id: 'gen_sample_1',
      voiceProfileId: 'voice_sample_1',
      voiceProfileName: 'Professional Speaker',
      text: 'Welcome to our quarterly business review. Today we\'ll be discussing our key achievements and future strategic initiatives.',
      audioUrl: 'https://placehold.co/600x100?text=Generated+Business+Presentation+Audio',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      duration: 12.4
    },
    {
      id: 'gen_sample_2',
      voiceProfileId: 'voice_sample_2',
      voiceProfileName: 'Friendly Narrator',
      text: 'Once upon a time, in a land far away, there lived a curious little fox who loved to explore the enchanted forest.',
      audioUrl: 'https://placehold.co/600x100?text=Generated+Story+Narration+Audio',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      duration: 15.8
    },
    {
      id: 'gen_sample_3',
      voiceProfileId: 'voice_sample_1',
      voiceProfileName: 'Professional Speaker',
      text: 'Thank you for joining today\'s webinar. We\'re excited to share the latest updates and answer your questions.',
      audioUrl: 'https://placehold.co/600x100?text=Generated+Webinar+Introduction+Audio',
      createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
      duration: 9.2
    },
    {
      id: 'gen_sample_4',
      voiceProfileId: 'voice_sample_3',
      voiceProfileName: 'Casual Conversational',
      text: 'Hey everyone! Just wanted to give you a quick update on what\'s been happening this week. It\'s been pretty exciting!',
      audioUrl: 'https://placehold.co/600x100?text=Generated+Casual+Update+Audio',
      createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
      duration: 8.7
    },
    {
      id: 'gen_sample_5',
      voiceProfileId: 'voice_sample_2',
      voiceProfileName: 'Friendly Narrator',
      text: 'In this tutorial, we\'ll walk through the steps to create your first voice clone. It\'s easier than you might think!',
      audioUrl: 'https://placehold.co/600x100?text=Generated+Tutorial+Audio',
      createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      duration: 11.3
    }
  ];

  // Add sample history if none exists
  if (generationHistory.length === 0) {
    generationHistory.push(...sampleHistory);
  }

  return NextResponse.json({
    success: true,
    data: sampleHistory,
    message: 'Sample history created'
  });
}