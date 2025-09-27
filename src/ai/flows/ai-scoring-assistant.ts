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
  budget: z.number().describe('The proposed budget for the project. Can be 0 if not specified.'),
  description: z.string().describe('A detailed description of the project proposal.'),
});
export type AiScoreProjectProposalInput = z.infer<typeof AiScoreProjectProposalInputSchema>;

const AiScoreProjectProposalOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the project proposal.'),
  rationale: z.string().describe('The rationale for the scoring, based on budget, description, and innovation.'),
  score: z.number().min(0).max(100).describe('A score from 0 to 100 for the project proposal, based on factors like innovation, feasibility, budget, and potential impact.'),
});
export type AiScoreProjectProposalOutput = z.infer<typeof AiScoreProjectProposalOutputSchema>;

export async function aiScoreProjectProposal(input: AiScoreProjectProposalInput): Promise<AiScoreProjectProposalOutput> {
  return aiScoreProjectProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiScoreProjectProposalPrompt',
  input: {schema: AiScoreProjectProposalInputSchema},
  output: {schema: AiScoreProjectProposalOutputSchema},
  prompt: `You are an AI assistant that helps researchers to score project proposals.

  You will receive the project title, abstract, budget, and description.

  Based on this information, you must:
  1.  Provide a concise summary of the proposal.
  2.  Provide a rationale for the scoring, considering factors like innovation, feasibility, budget (if provided), and potential impact.
  3.  Provide a numerical score from 0 to 100 for the project proposal.

  Project Information:
  Title: {{{title}}}
  Abstract: {{{abstract}}}
  Budget: {{{budget}}}
  Description: {{{description}}}
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
