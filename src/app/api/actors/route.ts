
import { NextResponse } from 'next/server';
import { actors, dbState } from '@/lib/in-memory-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase();
    const age = searchParams.get('age');
    const build = searchParams.get('build');
    const sort = searchParams.get('sort');

    let filteredActors = [...actors];

    if (q) {
        filteredActors = filteredActors.filter(actor => actor.name.toLowerCase().includes(q));
    }
    if (build) {
        filteredActors = filteredActors.filter(actor => actor.physical_attributes.build === build);
    }
    if (sort) {
        const desc = sort.startsWith('-');
        const sortKey = desc ? sort.substring(1) : sort;
        filteredActors.sort((a,b) => {
            if (sortKey === 'name') return desc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
            if (sortKey === 'age') return desc ? b.age - a.age : a.age - b.age;
            return 0;
        })
    }


    // Add a delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(filteredActors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newActor = {
      id: dbState.nextActorId,
      name: data.name,
      age: data.age,
      gender: data.gender,
      physical_attributes: {
        height: data.height,
        build: data.build,
        hair_color: data.hairColor, // Note camelCase from form
        eye_color: data.eyeColor || 'brown' // a default
      },
      skills: data.skills.map((s: {value: string}) => s.value),
      emotional_traits: data.emotionalTraits.map((t: {value: string}) => t.value),
      portfolio_url: data.portfolioUrl,
      image_url: data.imageUrl || `https://picsum.photos/seed/${dbState.nextActorId}/200/200`,
      created_at: new Date().toISOString()
    };
    
    actors.push(newActor);
    dbState.nextActorId++;
    
    return NextResponse.json(newActor, { status: 201 });
  } catch (error: any) {
    console.error("Error adding actor:", error);
    return NextResponse.json({ error: 'Failed to create actor. ' + error.message }, { status: 500 });
  }
}
