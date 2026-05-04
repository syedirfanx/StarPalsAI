
import { NextResponse } from 'next/server';
import { roles } from '@/lib/in-memory-db';

function escapeCsvCell(cell: string) {
    if (cell.includes(',')) {
        return `"${cell}"`;
    }
    return cell;
}

export async function GET() {
  try {
    const headers = [
        'id', 'project_name', 'character_name', 'age_range_min', 'age_range_max', 
        'gender', 'required_skills', 'emotional_traits', 'genre', 'description'
    ];
    
    const csvRows = [headers.join(',')];

    for (const role of roles) {
        const skills = role.required_skills.join('|');
        const traits = role.emotional_traits.join('|');

        const row = [
            role.id,
            role.project_name,
            role.character_name,
            role.age_range_min,
            role.age_range_max,
            role.gender,
            skills,
            traits,
            role.genre,
            escapeCsvCell(role.description)
        ].map(String);
        
        csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="roles.csv"',
        },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
