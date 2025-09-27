
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { aiScoreProjectProposal, type AiScoreProjectProposalOutput } from "@/ai/flows/ai-scoring-assistant";
import { projectSchema } from "./validations";

export type FormState = {
  message: string;
  aiResult?: AiScoreProjectProposalOutput;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

// This is a shared function that can be used for both create and update.
async function scoreAndProcessProject(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = projectSchema.safeParse({
    titulo: formData.get("titulo"),
    resumen: formData.get("resumen"),
    presupuesto: Number(formData.get("presupuesto")) || undefined,
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
    console.log(`Project ${isEditing ? 'updated' : 'created'}:`, validatedFields.data);
    console.log("AI Scoring Result:", aiResult);
    
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
