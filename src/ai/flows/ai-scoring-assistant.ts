'use server';

/**
 * @fileOverview An AI scoring assistant for summarizing project proposals and providing an initial scoring rationale.
 *
 * - aiScoreProjectProposal - A function that handles the project proposal scoring process.
 * - AiScoreProjectProposalInput - The input type for the aiScoreProjectProposal function.
 * - AiScoreProjectProposalOutput - The return type for the aiScoreProjectProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiScoreProjectProposalInputSchema = z.object({
  title: z.string().describe('The title of the project proposal.'),
  abstract: z.string().describe('A brief summary of the project proposal.'),
  budget: z.number().describe('The proposed budget for the project.'),
  description: z.string().describe('A detailed description of the project proposal.'),
});
export type AiScoreProjectProposalInput = z.infer<typeof AiScoreProjectProposalInputSchema>;

const AiScoreProjectProposalOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the project proposal.'),
  rationale: z.string().describe('The rationale for the scoring, based on budget, description, and innovation.'),
});
export type AiScoreProjectProposalOutput = z.infer<typeof AiScoreProjectProposalOutputSchema>;

export async function aiScoreProjectProposal(input: AiScoreProjectProposalInput): Promise<AiScoreProjectProposalOutput> {
  return aiScoreProjectProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiScoreProjectProposalPrompt',
  input: {schema: AiScoreProjectProposalInputSchema},
  output: {schema: AiScoreProjectProposalOutputSchema},
  prompt: `You are an AI assistant that helps researchers to score the project proposals.

  You will receive the project title, abstract, budget, and description, and provide a summary of the proposal, and a rationale for the scoring, based on budget, description, and innovation.

  Title: {{{title}}}
  Abstract: {{{abstract}}}
  Budget: {{{budget}}}
  Description: {{{description}}}

  Summary:
  Rationale:
  `,
});

const aiScoreProjectProposalFlow = ai.defineFlow(
  {
    name: 'aiScoreProjectProposalFlow',
    inputSchema: AiScoreProjectProposalInputSchema,
    outputSchema: AiScoreProjectProposalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
