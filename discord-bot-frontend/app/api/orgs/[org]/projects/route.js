// app/api/orgs/[org]/projects/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { org } = params;
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || 'open';
  const per_page = parseInt(searchParams.get('per_page')) || 30;
  const page = parseInt(searchParams.get('page')) || 1;

  const GITHUB_API_URL = `https://api.github.com/orgs/${org}/projects`;

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const response = await axios.get(GITHUB_API_URL, {
      headers,
      params: { state, per_page, page },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching organization projects:', error.response?.data || error.message);
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}

export async function POST(request, { params }) {
  const { org } = params;
  const { name, body } = await request.json();

  if (!name) {
    return NextResponse.json({ message: 'Project name is required.' }, { status: 400 });
  }

  const GITHUB_API_URL = `https://api.github.com/orgs/${org}/projects`;

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(
      GITHUB_API_URL,
      { name, body },
      { headers }
    );
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating organization project:', error.response?.data || error.message);
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}
