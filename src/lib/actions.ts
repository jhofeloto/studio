
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { projectSchema } from "./validations";
import { mockProjects, mockUsers } from "./mock-data";
import type { AIResult, FormState } from "./definitions";
import { redirect } from "next/navigation";

const GENERIC_ERROR_MESSAGE = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";

/**
 * Simulates a call to an AI model to evaluate a project.
 * @param data The project data.
 * @returns A promise that resolves with the AI evaluation result.
 */
async function getAIAssessment(data: z.infer<typeof projectSchema>): Promise<AIResult> {
  console.log("Simulating AI assessment for:", data.titulo);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate AI scoring logic
  let score = 60;
  if (data.description.length > 50) score += 10;
  if (data.resumen.length > 20) score += 5;
  if (data.presupuesto && data.presupuesto > 10000) score += 8;
  if (data.entidadProponente.toLowerCase().includes("universidad")) score += 7;
  score = Math.min(score, 100); // Cap score at 100

  const summary = `El proyecto '${data.titulo}' tiene un enfoque en ${data.entidadProponente}. Con un presupuesto de ${data.presupuesto}, busca resolver un problema relevante.`;
  const scoreRationale = `El puntaje de ${score} se basa en la claridad del resumen, la longitud de la descripción y el presupuesto asignado. La entidad proponente parece tener experiencia.`;
  const improvementRecommendations = `Para mejorar: 1. Detallar más el plan de ejecución. 2. Aumentar el presupuesto para mayor impacto. 3. Especificar los KPIs para medir el éxito.`;

  console.log("AI Assessment complete.");
  return { score, summary, scoreRationale, improvementRecommendations };
}

/**
 * A shared function to process form data, validate it, get AI assessment, 
 * and return a consistent state object.
 * @param formData The form data from the client.
 * @param isEditing A flag to indicate if we are creating or updating.
 * @returns A promise that resolves to the new form state.
 */
async function scoreAndProcessProject(
  formData: FormData,
): Promise<FormState> {
  const validatedFields = projectSchema.safeParse({
    titulo: formData.get("titulo"),
    resumen: formData.get("resumen"),
    // Convert empty string or null to undefined for optional number
    presupuesto: formData.get("presupuesto") ? Number(formData.get("presupuesto")) : undefined,
    entidadProponente: formData.get("entidadProponente"),
    description: formData.get("description"),
    estado: formData.get("estado"),
    isPublic: formData.get("isPublic") === "true",
  });

  // If form validation fails, return errors promptly.
  if (!validatedFields.success) {
    console.log("Server-side validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Error: Por favor, revisa los campos del formulario.",
      errors: validatedFields.error.flatten().fieldErrors,
      aiResult: null,
    };
  }

  try {
    // Simulate AI assessment
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
      const { score, summary, scoreRationale, improvementRecommendations, ...projectData } = result.aiResult;
      
      const newProject = {
          ...projectData,
          id: `proj-${Date.now()}`,
          plazo: new Date(), // Placeholder
          createdAt: new Date(),
          leadInvestigatorId: 'user-1', // Placeholder for logged-in user
          leadInvestigator: mockUsers.find(u => u.id === 'user-1')!,
          collaborators: [],
          products: [],
          attachments: [], // Placeholder for file handling
          imageId: `proj_${Math.floor(Math.random() * 4) + 1}`,
          aiScore: score,
          aiSummary: summary,
          aiRationale: scoreRationale,
          aiRecommendations: improvementRecommendations,
      };

      mockProjects.unshift(newProject); // Add to the start of the array
      console.log("New project created:", newProject.id);

      // This path is revalidated, but the client-side will handle the redirect.
      revalidatePath("/dashboard");
  }
  
  return result;
}


/**
 * Server Action to update an existing project.
 */
export async function updateProjectAction(formData: FormData): Promise<FormState> {
  const projectId = formData.get("id") as string;
  if (!projectId) {
    return { message: "Error: ID de proyecto no encontrado.", errors: null, aiResult: null };
  }

  const result = await scoreAndProcessProject(formData);

  if (result.aiResult) {
      const { score, summary, scoreRationale, improvementRecommendations, ...projectData } = result.aiResult;
      
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
          return { message: "Error: Proyecto no encontrado para actualizar.", errors: null, aiResult: null };
      }

      // Update project data
      mockProjects[projectIndex] = {
          ...mockProjects[projectIndex], // Retain existing fields like collaborators, products etc.
          ...projectData,
          aiScore: score,
          aiSummary: summary,
          aiRationale: scoreRationale,
          aiRecommendations: improvementRecommendations,
      };
      
      console.log("Project updated:", projectId);

      // Revalidate both the dashboard and the specific project page
      revalidatePath("/dashboard");
      revalidatePath(`/projects/${projectId}/edit`);

      // Return a simple success message for updates, redirection is handled client-side
      return { message: "¡Proyecto actualizado y re-evaluado con éxito!", errors: null, aiResult: null };
  }
  
  return result;
}
