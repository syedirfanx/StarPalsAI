'use server';

/**
 * @fileOverview Role description generator.
 *
 * - generateRoleDescription - A function that generates a detailed role description from a brief character outline.
 * - GenerateRoleDescriptionInput - The input type for the generateRoleDescription function.
 * - GenerateRoleDescriptionOutput - The return type for the generateRoleDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoleDescriptionInputSchema = z.object({
  characterOutline: z
    .string()
    .describe('A brief outline of the character for whom the role description is to be generated.'),
});
export type GenerateRoleDescriptionInput = z.infer<typeof GenerateRoleDescriptionInputSchema>;

const GenerateRoleDescriptionOutputSchema = z.object({
  roleDescription: z
    .string()
    .describe('A detailed role description generated from the character outline.'),
});
export type GenerateRoleDescriptionOutput = z.infer<typeof GenerateRoleDescriptionOutputSchema>;

export async function generateRoleDescription(
  input: GenerateRoleDescriptionInput
): Promise<GenerateRoleDescriptionOutput> {
  return generateRoleDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoleDescriptionPrompt',
  input: {schema: GenerateRoleDescriptionInputSchema},
  output: {schema: GenerateRoleDescriptionOutputSchema},
  prompt: `You are a casting director. Generate a detailed role description from the following character outline:\n\nCharacter Outline: {{{characterOutline}}}\n\nRole Description: `,
});

const generateRoleDescriptionFlow = ai.defineFlow(
  {
    name: 'generateRoleDescriptionFlow',
    inputSchema: GenerateRoleDescriptionInputSchema,
    outputSchema: GenerateRoleDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
