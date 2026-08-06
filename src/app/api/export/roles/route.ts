import { NextResponse } from 'next/server';
import { roles } from '@/lib/in-memory-db';

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
        'id', 'project_name', 'character_name', 'age_range_min', 'age_range_max', 
        'gender', 'required_skills', 'emotional_traits', 'genre', 'description'
    ];
    
    const csvRows = [headers.join(',')];

    // 2. Map your local array data to CSV rows
    for (const role of roles) {
        // Flatten arrays safely into string blocks separated by pipes (|)
        const skills = role.required_skills ? role.required_skills.join('|') : '';
        const traits = role.emotional_traits ? role.emotional_traits.join('|') : '';

        const row = [
            role.id || '',
            role.project_name || '',
            role.character_name || '',
            role.age_range_min ?? '',
            role.age_range_max ?? '',
            role.gender || '',
            skills,
            traits,
            role.genre || '',
            role.description || ''
        ].map(String).map(escapeCsvCell); // Safely escape all cells to prevent row-splitting commas
        
        csvRows.push(row.join(','));
    }

    // 3. Construct final file string
    const csvContent = csvRows.join('\n');

    // 4. Return file down to the browser with correct download headers
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
