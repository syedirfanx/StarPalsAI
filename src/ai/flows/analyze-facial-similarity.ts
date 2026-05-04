'use server';
/**
 * @fileOverview An AI agent for analyzing facial similarity between two actors.
 *
 * - analyzeFacialSimilarity - A function that analyzes two actor headshots and provides a similarity score and analysis.
 * - AnalyzeFacialSimilarityInput - The input type for the analyzeFacialSimilarity function.
 * - AnalyzeFacialSimilarityOutput - The return type for the analyzeFacialSimilarity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFacialSimilarityInputSchema = z.object({
  actorAName: z.string().describe("The name of the main actor."),
  actorAImageUrl: z.string().describe("The image URL for the main actor."),
  actorBName: z.string().describe("The name of the potential child match."),
  actorBImageUrl: z.string().describe("The image URL for the potential child match."),
});
export type AnalyzeFacialSimilarityInput = z.infer<typeof AnalyzeFacialSimilarityInputSchema>;

const AnalyzeFacialSimilarityOutputSchema = z.object({
  similarityScore: z.number().min(0).max(100).describe("A score from 0-100 representing the likelihood that Actor B could play a younger Actor A."),
  analysis: z.string().describe("A brief, one-sentence analysis of the facial similarity, mentioning key features."),
});
export type AnalyzeFacialSimilarityOutput = z.infer<typeof AnalyzeFacialSimilarityOutputSchema>;

export async function analyzeFacialSimilarity(input: AnalyzeFacialSimilarityInput): Promise<AnalyzeFacialSimilarityOutput> {
  return analyzeFacialSimilarityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFacialSimilarityPrompt',
  input: {schema: AnalyzeFacialSimilarityInputSchema},
  output: {schema: AnalyzeFacialSimilarityOutputSchema},
  prompt: `You are a casting director's assistant with an expert eye for facial similarities. Analyze the two headshots provided. Based on facial structure (jawline, nose, eyes, face shape), determine how likely it is that {{{actorBName}}} could play a younger version of {{{actorAName}}}.

Provide a similarity score from 0 to 100 and a brief one-sentence analysis explaining your reasoning. Focus only on facial features.

Actor A ({{{actorAName}}}): {{media url=actorAImageUrl}}
Actor B ({{{actorBName}}}): {{media url=actorBImageUrl}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});


const analyzeFacialSimilarityFlow = ai.defineFlow(
  {
    name: 'analyzeFacialSimilarityFlow',
    inputSchema: AnalyzeFacialSimilarityInputSchema,
    outputSchema: AnalyzeFacialSimilarityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
