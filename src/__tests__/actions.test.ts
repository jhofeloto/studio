
import { createProjectAction, createProductAction } from '../lib/actions';
import { mockProjects, mockUsers } from '../lib/mock-data';
import { projectSchema, productSchema } from '../lib/validations';
import { aiScoreProjectProposal } from '@/ai/flows/ai-scoring-assistant';

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

describe('Project Actions', () => {
  it('should create a new project', async () => {
    const formData = new FormData();
    formData.append('titulo', 'Nuevo Proyecto de Prueba');
    formData.append('resumen', 'Este es un resumen suficientemente largo para pasar la validación del esquema del proyecto.');
    formData.append('presupuesto', '100000');
    formData.append('entidadProponente', 'Entidad de Prueba');
    formData.append('isPublic', 'on');
    formData.append('estado', 'PROPUESTO');
    formData.append('description', 'Descripción detallada del proyecto.');

    const initialState = { message: '' };
    const result = await createProjectAction(initialState, formData);

    expect(result.message).toContain('¡Propuesta de proyecto creada y evaluada con éxito!');
    expect(mockProjects[0].titulo).toBe('Nuevo Proyecto de Prueba');
    expect(aiScoreProjectProposal).toHaveBeenCalled();
  });
});

describe('Product Actions', () => {
  it('should create a new product for a project', async () => {
    const project = mockProjects[0];
    const formData = new FormData();
    formData.append('titulo', 'Nuevo Producto de Prueba');
    formData.append('descripcion', 'Descripción del producto de prueba.');
    formData.append('productType', 'ART_OPEN_A1');
    formData.append('isPublic', 'true');
    formData.append('projectId', project.id);

    const result = await createProductAction(formData);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Producto creado con éxito.');
    expect(project.products[0].titulo).toBe('Nuevo Producto de Prueba');
  });
});
