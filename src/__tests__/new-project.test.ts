
import { createProjectAction } from '../lib/actions';
import { mockProjects } from '../lib/mock-data';

jest.mock('@/ai/flows/ai-scoring-assistant', () => ({
  aiScoreProjectProposal: jest.fn().mockResolvedValue({
    score: 85,
    summary: 'AI Summary',
    scoreRationale: 'AI Rationale',
    improvementRecommendations: 'AI Recommendations',
  }),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Create new project', () => {
  it('should create a new project and add it to the project list', async () => {
    const initialProjectCount = mockProjects.length;

    const formData = new FormData();
    formData.append('titulo', 'Super Awesome Project');
    formData.append(
      'resumen',
      'This is a summary of the super awesome project. It is long enough to pass the validation.'
    );
    formData.append('presupuesto', '120000');
    formData.append('entidadProponente', 'Test Entity');
    formData.append('isPublic', 'on');
    formData.append('estado', 'PROPUESTO');
    formData.append('description', 'This is a detailed description of the project.');

    const initialState = { message: '' };
    const result = await createProjectAction(initialState, formData);

    expect(result.message).toContain('¡Propuesta de proyecto creada y evaluada con éxito!');

    // Check that the new project has been added to the mockProjects array
    expect(mockProjects.length).toBe(initialProjectCount + 1);

    const newProject = mockProjects.find((p) => p.titulo === 'Super Awesome Project');
    expect(newProject).toBeDefined();
    expect(newProject?.resumen).toBe(
      'This is a summary of the super awesome project. It is long enough to pass the validation.'
    );
  });
});
