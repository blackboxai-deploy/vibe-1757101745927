import { NextRequest, NextResponse } from 'next/server';

// Mock storage - in production, use a proper database
const voiceProfiles: any[] = [];

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const profileIndex = voiceProfiles.findIndex(profile => profile.id === id);
    
    if (profileIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Voice profile not found' },
        { status: 404 }
      );
    }

    // Remove the profile
    voiceProfiles.splice(profileIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Voice profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete voice profile' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const profile = voiceProfiles.find(profile => profile.id === id);
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Voice profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
      message: 'Voice profile retrieved successfully'
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve voice profile' },
      { status: 500 }
    );
  }
}