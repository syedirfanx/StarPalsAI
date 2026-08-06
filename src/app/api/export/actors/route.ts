import { NextResponse } from 'next/server';
import { actors } from '@/lib/in-memory-db';

// Helper function to safely handle strings containing commas
function escapeCsvCell(cell: string) {
    if (cell.includes(',')) {
        return `"${cell}"`;
    }
    return cell;
}

export async function GET() {
  try {
    // 1. Define the CSV columns headers
    const headers = [
        'id', 'name', 'age', 'gender', 'height', 'build', 'hair_color', 'eye_color',
        'skills', 'emotional_traits', 'portfolio_url', 'image_url'
    ];
    
    const csvRows = [headers.join(',')];

    // 2. Map your local array data to CSV rows
    for (const actor of actors) {
        // Flatten arrays into string blocks separated by pipes (|)
        const skills = actor.skills ? actor.skills.join('|') : '';
        const traits = actor.emotional_traits ? actor.emotional_traits.join('|') : '';

        const row = [
            actor.id,
            actor.name,
            actor.age,
            actor.gender,
            actor.physical_attributes?.height || '',
            actor.physical_attributes?.build || '',
            actor.physical_attributes?.hair_color || '',
            actor.physical_attributes?.eye_color || '',
            skills,
            traits,
            actor.portfolio_url || '',
            actor.image_url || ''
        ].map(String).map(escapeCsvCell);
        
        csvRows.push(row.join(','));
    }

    // 3. Construct final file string
    const csvContent = csvRows.join('\n');

    // 4. Return file down to the browser with correct download headers
    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="actors.csv"',
        },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
