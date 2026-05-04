
import { analyzeFacialSimilarity } from '@/ai/flows/analyze-facial-similarity';
import type { AnalyzeFacialSimilarityInput } from '@/ai/flows/analyze-facial-similarity';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeFacialSimilarityInput = await req.json();
    const { actorAName, actorAImageUrl, actorBName, actorBImageUrl } = body;
    if (!actorAName || !actorAImageUrl || !actorBName || !actorBImageUrl) {
      return NextResponse.json({ error: 'All actor details are required' }, { status: 400 });
    }

    // Helper to fetch image and convert to data URI
    const convertToDataUrl = async (url: string): Promise<string> => {
        const response = await fetch(url, {
            headers: {
                // Add a user-agent to be polite to Wikimedia servers
                'User-Agent': 'StarPalsAI/1.0 (CastingTool/App; +https://github.com/your-repo/info)'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error downloading media '${url}': ${errorText}`);
        }
        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        return `data:${blob.type};base64,${buffer.toString('base64')}`;
    };

    // Convert image URLs to data URIs to avoid rate limiting and download issues on the AI side.
    // We do this sequentially to be extra careful with Wikimedia rate limits.
    const actorADataUrl = await convertToDataUrl(actorAImageUrl);
    const actorBDataUrl = await convertToDataUrl(actorBImageUrl);
    
    const result = await analyzeFacialSimilarity({ 
        actorAName, 
        actorAImageUrl: actorADataUrl, 
        actorBName, 
        actorBImageUrl: actorBDataUrl 
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing facial similarity:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to analyze similarity: ${errorMessage}` }, { status: 500 });
  }
}
