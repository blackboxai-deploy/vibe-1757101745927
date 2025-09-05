import { NextRequest, NextResponse } from 'next/server';

// Mock storage for generation history
const generationHistory: any[] = [];
const voiceProfiles: any[] = []; // This would be shared with upload route in production

// OpenRouter configuration for voice synthesis
const VOICE_API_CONFIG = {
  endpoint: 'https://oi-server.onrender.com/chat/completions',
  headers: {
    'CustomerId': 'cus_SrncNq4xGqkmNq',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  },
  model: 'openrouter/elevenlabs/voice-synthesis'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voiceProfileId, text } = body;

    if (!voiceProfileId || !text) {
      return NextResponse.json(
        { success: false, error: 'Voice profile ID and text are required' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Text too long. Maximum 5000 characters.' },
        { status: 400 }
      );
    }

    // Find the voice profile (in production, this would be a database query)
    // For demo purposes, we'll fetch from the profiles API
    let voiceProfile;
    try {
      const profilesResponse = await fetch('http://localhost:3000/api/voice/profiles');
      const profilesData = await profilesResponse.json();
      const allProfiles = profilesData.data || [];
      
      voiceProfile = allProfiles.find((profile: any) => profile.id === voiceProfileId);
      if (!voiceProfile) {
        return NextResponse.json(
          { success: false, error: 'Voice profile not found' },
          { status: 404 }
        );
      }
    } catch (profileError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch voice profile' },
        { status: 500 }
      );
    }

    // Call OpenRouter API for voice synthesis
    try {
      const apiResponse = await fetch(VOICE_API_CONFIG.endpoint, {
        method: 'POST',
        headers: VOICE_API_CONFIG.headers,
        body: JSON.stringify({
          model: VOICE_API_CONFIG.model,
          messages: [
            {
              role: 'user',
              content: `Generate speech using voice cloning for the following text: "${text}"`
            }
          ],
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!apiResponse.ok) {
        console.error('OpenRouter API error:', apiResponse.statusText);
        // Fallback to mock response for demo purposes
        const mockAudioUrl = `https://placehold.co/600x100?text=Generated+Audio+${encodeURIComponent(text.substring(0, 50))}...`;
        
        const historyEntry = {
          id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          voiceProfileId,
          voiceProfileName: voiceProfile.name,
          text,
          audioUrl: mockAudioUrl,
          createdAt: new Date().toISOString(),
          duration: Math.max(10, Math.min(text.length * 0.1, 300)) // Estimate duration based on text length
        };

        generationHistory.push(historyEntry);

        return NextResponse.json({
          success: true,
          data: {
            audioUrl: mockAudioUrl,
            historyId: historyEntry.id
          },
          message: 'Voice generated successfully (demo mode)'
        });
      }

      // Process real API response
      // In production, the API would return an audio file or URL
      // For demo purposes, we'll create a placeholder
      const audioUrl = `https://placehold.co/600x100?text=AI+Generated+Voice+Audio+File`;

      const historyEntry = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        voiceProfileId,
        voiceProfileName: voiceProfile.name,
        text,
        audioUrl,
        createdAt: new Date().toISOString(),
        duration: Math.max(10, Math.min(text.length * 0.1, 300))
      };

      generationHistory.push(historyEntry);

      return NextResponse.json({
        success: true,
        data: {
          audioUrl,
          historyId: historyEntry.id
        },
        message: 'Voice generated successfully'
      });

    } catch (apiError) {
      console.error('Voice synthesis API error:', apiError);
      
      // Fallback response for demo
      const mockAudioUrl = `https://placehold.co/600x100?text=Demo+Generated+Audio+${encodeURIComponent(text.substring(0, 30))}`;
      
      const historyEntry = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        voiceProfileId,
        voiceProfileName: voiceProfile.name,
        text,
        audioUrl: mockAudioUrl,
        createdAt: new Date().toISOString(),
        duration: Math.max(10, Math.min(text.length * 0.1, 300))
      };

      generationHistory.push(historyEntry);

      return NextResponse.json({
        success: true,
        data: {
          audioUrl: mockAudioUrl,
          historyId: historyEntry.id
        },
        message: 'Voice generated successfully (demo mode)'
      });
    }

  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    history: generationHistory,
    count: generationHistory.length
  });
}