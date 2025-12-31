import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Project } from '@/lib/data';

// GET all projects
export async function GET() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`
      SELECT 
        id,
        name,
        logo,
        launch_date as "launchDate",
        network,
        token,
        category,
        notes,
        launch_type as "launchType",
        verification_status as "verificationStatus",
        status,
        narrative_tags as "narrativeTags",
        github_url as "githubUrl",
        medium_url as "mediumUrl",
        farcaster_url as "farcasterUrl",
        base_url as "baseUrl"
      FROM projects
      ORDER BY launch_date ASC
    `);
    
    // Convert launch_date to ISO string
    const projects = result.rows.map(row => ({
      ...row,
      launchDate: row.launchDate?.toISOString() || null
    }));
    
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to fetch projects',
      error: (error as Error).message 
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

// POST create a new project (requires admin password in header)
export async function POST(request: Request) {
  // Basic authentication check - requires ADMIN_PASSWORD env var
  const authHeader = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Unauthorized: Invalid or missing admin password' 
    }, { status: 401 });
  }

  let client;
  try {
    const project: Project = await request.json();
    
    // Basic validation
    if (!project.id || !project.name || !project.logo) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Missing required fields: id, name, logo' 
      }, { status: 400 });
    }
    
    client = await pool.connect();
    
    await client.query(`
      INSERT INTO projects (
        id, name, logo, launch_date, network, token, category, notes,
        launch_type, verification_status, status, narrative_tags,
        github_url, medium_url, farcaster_url, base_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        logo = EXCLUDED.logo,
        launch_date = EXCLUDED.launch_date,
        network = EXCLUDED.network,
        token = EXCLUDED.token,
        category = EXCLUDED.category,
        notes = EXCLUDED.notes,
        launch_type = EXCLUDED.launch_type,
        verification_status = EXCLUDED.verification_status,
        status = EXCLUDED.status,
        narrative_tags = EXCLUDED.narrative_tags,
        github_url = EXCLUDED.github_url,
        medium_url = EXCLUDED.medium_url,
        farcaster_url = EXCLUDED.farcaster_url,
        base_url = EXCLUDED.base_url,
        updated_at = NOW()
    `, [
      project.id,
      project.name,
      project.logo,
      project.launchDate,
      project.network,
      project.token || null,
      project.category,
      project.notes || null,
      project.launchType || null,
      project.verificationStatus || null,
      project.status || null,
      project.narrativeTags || null,
      project.githubUrl || null,
      project.mediumUrl || null,
      project.farcasterUrl || null,
      project.baseUrl || null
    ]);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Project created/updated successfully!' 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to create project',
      error: (error as Error).message 
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
