
import { NextResponse } from 'next/server';
import { actors, dbState } from '@/lib/in-memory-db';
import type { Actor } from '@/lib/types';

// GET a single actor by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const actor = actors.find((a) => a.id === id);
    if (actor) {
      return NextResponse.json(actor);
    }
    return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE an actor by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const index = actors.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
    }
    
    const data = await request.json();
    const existingActor = actors[index];

    const updatedActor: Actor = {
      ...existingActor,
      name: data.name,
      age: data.age,
      gender: data.gender,
      physical_attributes: {
        ...existingActor.physical_attributes,
        height: data.height,
        build: data.build,
        hair_color: data.hairColor,
        eye_color: data.eyeColor,
      },
      skills: data.skills.map((s: {value: string}) => s.value),
      emotional_traits: data.emotionalTraits.map((t: {value: string}) => t.value),
      portfolio_url: data.portfolioUrl,
      image_url: data.imageUrl || existingActor.image_url,
    };
    
    actors[index] = updatedActor;
    
    return NextResponse.json(updatedActor);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update actor. ' + error.message }, { status: 500 });
  }
}

// DELETE an actor by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const index = actors.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Actor not found' }, { status: 404 });
    }
    
    actors.splice(index, 1);
    
    return NextResponse.json({ success: true, message: `Actor with id ${id} deleted` });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete actor. ' + error.message }, { status: 500 });
  }
}
