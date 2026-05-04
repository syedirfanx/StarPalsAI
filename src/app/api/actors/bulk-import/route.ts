import { NextResponse } from 'next/server';
import { actors, dbState } from '@/lib/in-memory-db';
import type { Actor } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { actors: newActorsData } = await request.json();

    if (!Array.isArray(newActorsData)) {
        return NextResponse.json({ error: 'Expected an array of actors.' }, { status: 400 });
    }
    
    let currentId = dbState.nextActorId;
    const insertedActors: Actor[] = [];

    for (const actorData of newActorsData) {
      const newActor: Actor = {
        id: currentId,
        name: actorData.name,
        age: actorData.age,
        gender: actorData.gender || 'any',
        physical_attributes: {
          height: actorData.height || 'average',
          build: actorData.build || 'average',
          hair_color: actorData.hair_color || 'brown',
          eye_color: 'brown',
        },
        skills: actorData.skills || [],
        emotional_traits: actorData.emotional_traits || [],
        portfolio_url: actorData.portfolio_url || '',
        image_url: actorData.image_url || `https://picsum.photos/seed/${currentId}/200/200`,
        created_at: new Date().toISOString(),
      };
      actors.push(newActor);
      insertedActors.push(newActor);
      currentId++;
    }
    
    dbState.nextActorId = currentId;

    return NextResponse.json({
      success: true,
      insertedCount: insertedActors.length,
    });

  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
