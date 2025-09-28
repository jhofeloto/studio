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
  scoreRationale: z.string().describe('The rationale for the scoring, based on budget, description, and innovation.'),
  improvementRecommendations: z.string().describe('Specific, actionable recommendations to improve the proposal and its score.'),
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
  prompt: `You are an expert AI assistant that helps researchers evaluate and improve project proposals for a Science, Technology, and Innovation (CTeI) fund.

  You will receive the project title, abstract, budget, and a detailed description.

  Based on this information, you must perform the following tasks and provide the output in a structured format:
  1.  **Summary:** Provide a concise summary of the proposal's main objectives and methodology.
  2.  **Score:** Assign a numerical score from 0 to 100, based on factors like innovation, clarity, feasibility, budget coherence, and potential impact.
  3.  **Score Rationale:** Briefly explain the reasoning behind the score you assigned. Mention the strengths and weaknesses that influenced your decision.
  4.  **Improvement Recommendations:** Provide specific, actionable recommendations on how to improve the proposal. The recommendations should be constructive and aimed at helping the user increase the project's potential and score.

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
