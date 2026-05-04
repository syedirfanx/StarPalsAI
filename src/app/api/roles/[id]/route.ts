
import { NextResponse } from 'next/server';
import { roles, dbState } from '@/lib/in-memory-db';
import type { Role } from '@/lib/types';

// GET a single role by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const role = roles.find((r) => r.id === id);
    if (role) {
      return NextResponse.json(role);
    }
    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE a role by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const index = roles.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }
    
    const data = await request.json();
    const existingRole = roles[index];

    const updatedRole: Role = {
      ...existingRole,
      project_name: data.projectName,
      character_name: data.characterName,
      age_range_min: data.ageMin,
      age_range_max: data.ageMax,
      gender: data.gender,
      required_skills: data.requiredSkills.map((s: {value: string}) => s.value),
      emotional_traits: data.emotionalTraits.map((t: {value: string}) => t.value),
      genre: data.genre,
      description: data.description,
    };
    
    roles[index] = updatedRole;
    
    return NextResponse.json(updatedRole);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update role. ' + error.message }, { status: 500 });
  }
}

// DELETE a role by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const index = roles.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }
    
    roles.splice(index, 1);
    
    return NextResponse.json({ success: true, message: `Role with id ${id} deleted` });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete role. ' + error.message }, { status: 500 });
  }
}
