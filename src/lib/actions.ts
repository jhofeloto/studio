"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { productSchema } from "./validations";
import { mockProjects, mockUsers } from "./mock-data";
import type { AIResult, FormState, ProductFormState } from "./definitions";


const GENERIC_ERROR_MESSAGE = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";


/**
 * Simulates a call to an AI model to evaluate a project.
 * @param data The project data.
 * @returns A promise that resolves with the AI evaluation result.
 */
async function getAIAssessment(data: z.infer<typeof productSchema>): Promise<AIResult> {
  console.log("Simulating AI assessment for:", data.titulo);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const summary = `El proyecto '${data.titulo}' parece bien estructurado. La metodología es sólida y el presupuesto es adecuado.`;
  const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
  const improvementRecommendations = [
      "Considerar la inclusión de un plan de mitigación de riesgos más detallado.",
      "Explorar la posibilidad de colaborar con instituciones internacionales para ampliar el alcance.",
      "Añadir un cronograma con hitos intermedios más específicos."
  ];
  
  return { summary, score, improvementRecommendations };
}

/**
 * A shared function to process form data, validate it, get AI assessment, 
 * and return a consistent state object.
 * @param formData The form data from the client.
 * @returns A promise that resolves to the new form state.
 */
async function scoreAndProcessProject(
  formData: FormData
): Promise<FormState> {
  const validatedFields = productSchema.safeParse({
    titulo: formData.get("titulo"),
    resumen: formData.get("resumen"),
    presupuesto: formData.get("presupuesto") ? Number(formData.get("presupuesto")) : undefined,
    entidadProponente: formData.get("entidadProponente"),
    description: formData.get("description"),
    estado: formData.get("estado"),
    isPublic: formData.get("isPublic") === "true",
  });

  if (!validatedFields.success) {
    console.log("Server-side validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Error: Por favor, revisa los campos del formulario.",
      errors: validatedFields.error.flatten().fieldErrors,
      aiResult: null,
    };
  }

  try {
    const aiResult = await getAIAssessment(validatedFields.data);
    
    return {
        message: "¡Proyecto evaluado con éxito!",
        errors: null,
        aiResult: { ...aiResult, ...validatedFields.data }
    };

  } catch (error) {
    console.error("Error during AI assessment:", error);
    return {
      message: GENERIC_ERROR_MESSAGE,
      errors: null,
      aiResult: null,
    };
  }
}

/**
 * Server Action to create a new project.
 */
export async function createProjectAction(formData: FormData): Promise<FormState> {
  const result = await scoreAndProcessProject(formData);
  
  if (result.aiResult) {
      const { score, summary, improvementRecommendations, ...projectData } = result.aiResult;
      
      const newProject = {
          ...projectData,
          id: `proj-${Date.now()}`,
          plazo: new Date(),
          createdAt: new Date(),
          leadInvestigatorId: 'user-1',
          leadInvestigator: mockUsers.find(u => u.id === 'user-1')!,
          collaborators: [],
          products: [],
          attachments: [],
          imageId: `proj_${Math.floor(Math.random() * 4) + 1}`,
          aiScore: score,
          aiSummary: summary,
          aiRecommendations: improvementRecommendations,
      };

      mockProjects.unshift(newProject);
      console.log("New project created:", newProject.id);

      // Revalidate relevant paths
      revalidatePath("/dashboard");
      revalidatePath("/projects");
  }
  
  return result;
}

/**
 * Server Action to update an existing project.
 */
export async function updateProjectAction(formData: FormData): Promise<FormState> {
  const result = await scoreAndProcessProject(formData);
  
  if (result.aiResult) {
      const { score, summary, improvementRecommendations, ...projectData } = result.aiResult;
      const projectId = formData.get("id") as string;
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
          return { message: "Error: Proyecto no encontrado para actualizar.", errors: null, aiResult: null };
      }

      mockProjects[projectIndex] = {
          ...mockProjects[projectIndex],
          ...projectData,
          aiScore: score,
          aiSummary: summary,
          aiRecommendations: improvementRecommendations,
      };
      
      console.log("Project updated:", projectId);

      // Revalidate relevant paths specifically
      revalidatePath("/dashboard");
      revalidatePath("/projects");
      revalidatePath(`/projects/${projectId}/edit`);

      return { message: "¡Proyecto actualizado y re-evaluado con éxito!", errors: null, aiResult: null };
  }
  
  return result;
}

/**
 * Server Action to create a new derived product for a project.
 */
export async function createProductAction(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
    const rawData = {
        titulo: formData.get('titulo'),
        tipo: formData.get('tipo'),
        url: formData.get('url'),
        projectId: formData.get('projectId'),
        descripcion: formData.get('descripcion')
    };

    const validatedFields = productSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            message: 'Error: Revisa los campos del formulario de producto.',
            errors: validatedFields.error.flatten().fieldErrors,
            fields: rawData, // Return the raw data to repopulate the form
        };
    }

    const { projectId, ...productData } = validatedFields.data;

    const projectIndex = mockProjects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
        return { message: 'Error: El proyecto asociado no fue encontrado.' };
    }

    const newProduct = {
        ...productData,
        id: `prod-${Date.now()}`,
        status: 'PENDIENTE' as const, // Default status
    };

    mockProjects[projectIndex].products.push(newProduct);

    console.log(`New product added to project ${projectId}`);
    
    // Revalidate the edit page to show the new product
    revalidatePath(`/projects/${projectId}/edit`);

    return { message: '¡Producto derivado añadido con éxito!', errors: null, fields: null };
}
