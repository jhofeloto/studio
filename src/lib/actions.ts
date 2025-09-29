
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { aiScoreProjectProposal, type AiScoreProjectProposalOutput } from "@/ai/flows/ai-scoring-assistant";
import { projectSchema, productSchema } from "./validations";

export type FormState = {
  message: string;
  aiResult?: AiScoreProjectProposalOutput;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export type ProductFormState = {
    message: string;
    errors?: {
        [key: string]: string[] | undefined;
    };
}

// This is a shared function that can be used for both create and update.
async function scoreAndProcessProject(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = projectSchema.safeParse({
    titulo: formData.get("titulo"),
    resumen: formData.get("resumen"),
    presupuesto: formData.get("presupuesto") ? Number(formData.get("presupuesto")) : undefined,
    entidadProponente: formData.get("entidadProponente"),
    isPublic: formData.get("isPublic") === "on",
    estado: formData.get("estado"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      message: "Error: Please check the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { titulo, resumen, presupuesto, description } = validatedFields.data;
  const isEditing = formData.get("id") !== null;

  try {
    const aiResult = await aiScoreProjectProposal({
      title: titulo,
      abstract: resumen,
      budget: presupuesto || 0,
      description: description || "",
    });

    // Here you would typically save the project to the database
    // We are logging it to simulate the save operation
    const projectDataToSave = {
      ...validatedFields.data,
      aiScore: aiResult.score,
      aiSummary: aiResult.summary,
      aiRationale: aiResult.scoreRationale,
      aiRecommendations: aiResult.improvementRecommendations,
    };
    console.log(`Project ${isEditing ? 'updated' : 'created'}:`, projectDataToSave);
    
    revalidatePath("/(admin)/projects");
    if (isEditing) {
        revalidatePath(`/(admin)/projects/${formData.get("id")}/edit`);
    }

    return {
      message: `¡Propuesta de proyecto ${isEditing ? 'actualizada' : 'creada'} y evaluada con éxito!`,
      aiResult,
    };
  } catch (error) {
    console.error("Error scoring project:", error);
    return {
      message: "An error occurred while scoring the project. Please try again.",
    };
  }
}

export const createProjectAction = scoreAndProcessProject;
export const updateProjectAction = scoreAndProcessProject;


export async function createProductAction(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
    const validatedFields = productSchema.safeParse({
        titulo: formData.get("titulo"),
        descripcion: formData.get("descripcion"),
        productType: formData.get("productType"),
        isPublic: formData.get("isPublic") === "on",
        projectId: formData.get("projectId"),
    });

    if (!validatedFields.success) {
        return {
            message: "Error: Revisa los campos del formulario.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const isEditing = formData.get("id") !== null;

    // Here you would save the product to the database.
    // We'll log it to simulate the save.
    console.log(`Product ${isEditing ? 'updated' : 'created'}:`, validatedFields.data);

    revalidatePath(`/(admin)/projects/${validatedFields.data.projectId}/edit`);
    revalidatePath("/(admin)/products");

    return {
        message: `Producto ${isEditing ? 'actualizado' : 'creado'} con éxito.`,
    };
}
