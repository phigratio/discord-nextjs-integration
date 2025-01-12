// app/api/projects/[project_id]/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { project_id } = params;

  const GITHUB_API_URL = `https://api.github.com/projects/${project_id}`;

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const response = await axios.get(GITHUB_API_URL, { headers });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error.response?.data || error.message);
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}

export async function PATCH(request, { params }) {
  const { project_id } = params;
  const { name, body, state, organization_permission, private: isPrivate } = await request.json();

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (body !== undefined) updateData.body = body;
  if (state !== undefined) updateData.state = state;
  if (organization_permission !== undefined) updateData.organization_permission = organization_permission;
  if (isPrivate !== undefined) updateData.private = isPrivate;

  const GITHUB_API_URL = `https://api.github.com/projects/${project_id}`;

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.patch(GITHUB_API_URL, updateData, { headers });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error.response?.data || error.message);
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}

export async function DELETE(request, { params }) {
  const { project_id } = params;

  const GITHUB_API_URL = `https://api.github.com/projects/${project_id}`;

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    await axios.delete(GITHUB_API_URL, { headers });
    return NextResponse.json({ message: 'Project deleted successfully.' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error.response?.data || error.message);
    return NextResponse.json({ message: error.message }, { status: error.response?.status || 500 });
  }
}
