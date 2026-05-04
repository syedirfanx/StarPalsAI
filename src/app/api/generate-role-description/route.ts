import { generateRoleDescription } from '@/ai/flows/generate-role-description';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { characterOutline } = await req.json();
    if (!characterOutline) {
      return NextResponse.json({ error: 'Character outline is required' }, { status: 400 });
    }
    const result = await generateRoleDescription({ characterOutline });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating role description:', error);
    return NextResponse.json({ error: 'Failed to generate role description' }, { status: 500 });
  }
}
