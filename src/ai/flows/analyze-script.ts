'use server';
/**
 * @fileOverview An AI agent for analyzing movie scripts to extract character details.
 *
 * - analyzeScript - A function that analyzes a script excerpt for a specific character.
 * - AnalyzeScriptInput - The input type for the analyzeScript function.
 * - AnalyzeScriptOutput - The return type for the analyzeScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScriptInputSchema = z.object({
  script_text: z.string().describe('The movie script excerpt to analyze.'),
  character_name: z.string().describe('The name of the character to analyze within the script.'),
});
export type AnalyzeScriptInput = z.infer<typeof AnalyzeScriptInputSchema>;

const AnalyzeScriptOutputSchema = z.object({
  character_name: z.string(),
  extracted_data: z.object({
    age_range_min: z.number().describe('The minimum estimated age for the character.'),
    age_range_max: z.number().describe('The maximum estimated age for the character.'),
    gender: z.enum(['male', 'female', 'any']).describe("The character's gender."),
    physical_requirements: z.object({
      height: z.enum(['tall', 'average', 'short']).describe("The character's height."),
      build: z.enum(['athletic', 'slim', 'average', 'heavy']).describe("The character's build."),
      hair_color: z.enum(['blonde', 'brown', 'black', 'red', 'gray', 'other']).describe("The character's hair color."),
      distinctive_features: z.array(z.string()).describe('Any distinctive physical features.'),
    }),
    required_skills: z.array(z.string()).describe('Skills the character demonstrates or possesses.'),
    emotional_traits: z.array(z.string()).describe('Key emotional traits or personality characteristics.'),
    genre: z.enum(['action', 'drama', 'comedy', 'romance', 'thriller', 'horror', 'sci-fi', 'fantasy', 'other']).describe('The genre of the script.'),
  }),
  confidence_score: z.number().min(0).max(100).describe('A confidence score (0-100) on how much detail was extractable from the script.'),
});
export type AnalyzeScriptOutput = z.infer<typeof AnalyzeScriptOutputSchema>;

export async function analyzeScript(input: AnalyzeScriptInput): Promise<AnalyzeScriptOutput> {
  return analyzeScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScriptPrompt',
  input: {schema: AnalyzeScriptInputSchema},
  output: {schema: AnalyzeScriptOutputSchema},
  prompt: `Analyze this movie script and extract details about the character '{{{character_name}}}'.

Script:
{{{script_text}}}

Extract and return ONLY a JSON object with the specified format.
Base your analysis ONLY on explicit descriptions and actions in the script. For gender, infer from pronouns (he/she) or names. If it's unclear, use "any".
If something is not mentioned, use reasonable defaults or leave arrays empty.
Also provide a confidence_score from 0-100 based on how much detail was available to extract.
`,
});

const analyzeScriptFlow = ai.defineFlow(
  {
    name: 'analyzeScriptFlow',
    inputSchema: AnalyzeScriptInputSchema,
    outputSchema: AnalyzeScriptOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
