// frontend/app/api/channels/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch channels from the backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is OK (status code 200-299)
    if (!backendResponse.ok) {
      console.error('Backend responded with an error:', backendResponse.statusText);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch channels from backend.' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Validate backend response
    if (data.success) {
      return NextResponse.json({ success: true, channels: data.channels }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch channels.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching channels.' },
      { status: 500 }
    );
  }
}
