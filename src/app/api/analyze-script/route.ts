import { analyzeScript } from '@/ai/flows/analyze-script';
import type { AnalyzeScriptInput } from '@/ai/flows/analyze-script';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeScriptInput = await req.json();
    const { script_text, character_name } = body;
    if (!script_text || !character_name) {
      return NextResponse.json({ error: 'Script text and character name are required' }, { status: 400 });
    }
    const result = await analyzeScript({ script_text, character_name });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing script:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to analyze script: ${errorMessage}` }, { status: 500 });
  }
}
