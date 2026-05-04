
import { NextResponse } from 'next/server';
import { roles, dbState } from '@/lib/in-memory-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase();
    const genre = searchParams.get('genre');

    let filteredRoles = [...roles];

    if (q) {
        filteredRoles = filteredRoles.filter(role => 
            role.character_name.toLowerCase().includes(q) || 
            role.project_name.toLowerCase().includes(q)
        );
    }
    if(genre){
        filteredRoles = filteredRoles.filter(role => role.genre.toLowerCase() === genre.toLowerCase());
    }

    // Add a delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(filteredRoles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newRole = {
      id: dbState.nextRoleId,
      project_name: data.projectName,
      character_name: data.characterName,
      age_range_min: data.ageMin,
      age_range_max: data.ageMax,
      gender: data.gender,
      physical_requirements: {
        // The form doesn't currently support these, but could be added.
      },
      required_skills: data.requiredSkills.map((s: {value: string}) => s.value),
      emotional_traits: data.emotionalTraits.map((t: {value: string}) => t.value),
      genre: data.genre,
      description: data.description,
      created_at: new Date().toISOString()
    };
    
    roles.push(newRole);
    dbState.nextRoleId++;
    
    return NextResponse.json(newRole, { status: 201 });
  } catch (error: any) {
    console.error("Error creating role:", error);
    return NextResponse.json({ error: 'Failed to create role. ' + error.message }, { status: 500 });
  }
}
