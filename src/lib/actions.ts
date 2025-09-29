
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { aiScoreProjectProposal, type AiScoreProjectProposalOutput } from "@/ai/flows/ai-scoring-assistant";
import { projectSchema, productSchema } from "./validations";
import { mockProjects, mockUsers, mockProducts } from "./mock-data";
import type { Product, Project, Attachment } from "./definitions";


export type FormState = {
  message: string;
  aiResult?: AiScoreProjectProposalOutput;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export type ProductFormState = {
    message: string;
    success: boolean;
    errors?: {
        [key:string]: string[] | undefined;
    };
}

const handleAttachments = (formData: FormData, relatedId: string, relatedType: 'PROJECT' | 'PRODUCT'): Attachment[] => {
    // This is a simulation. In a real app, you would handle file uploads to a storage service.
    const files = formData.getAll("attachments");
    return files.map((file, i) => {
      if (file instanceof File && file.name && file.size > 0) {
        return {
          id: `att-${relatedId}-${Date.now()}-${i}`,
          filename: file.name,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: '#', // Placeholder URL
          relatedId: relatedId,
          relatedType: relatedType,
          uploadedAt: new Date(),
        };
      }
      return null;
    }).filter((att): att is Attachment => att !== null);
};


async function scoreAndProcessProject(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = projectSchema.safeParse({
    titulo: formData.get("titulo"),
    resumen: formData.get("resumen"),
    presupuesto: formData.get("presupuesto"),
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
  
  try {
    const aiResult = await aiScoreProjectProposal({
      title: titulo,
      abstract: resumen,
      budget: presupuesto || 0,
      description: description || "",
    });

    const projectId = formData.get("id") as string | null;
    const isEditing = !!projectId;

    if (isEditing) {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        const existingAttachments = JSON.parse(formData.get('existingAttachments') as string || '[]') as Attachment[];
        const newAttachments = handleAttachments(formData, projectId, 'PROJECT');
        
        mockProjects[projectIndex] = {
          ...mockProjects[projectIndex],
          ...validatedFields.data,
          presupuesto: validatedFields.data.presupuesto,
          attachments: [...existingAttachments, ...newAttachments],
          aiScore: aiResult.score,
          aiSummary: aiResult.summary,
          aiRationale: aiResult.scoreRationale,
          aiRecommendations: aiResult.improvementRecommendations,
        };
      }
    } else {
        const newProjectId = `proj-${Date.now()}`;
        const newAttachments = handleAttachments(formData, newProjectId, 'PROJECT');
        const newProject: Project = {
            id: newProjectId,
            ...validatedFields.data,
            presupuesto: validatedFields.data.presupuesto,
            plazo: new Date(),
            leadInvestigatorId: mockUsers[1].id,
            leadInvestigator: mockUsers[1],
            createdAt: new Date(),
            collaborators: [],
            products: [],
            attachments: newAttachments,
            imageId: `proj_${(mockProjects.length % 4) + 1}`,
            aiScore: aiResult.score,
            aiSummary: aiResult.summary,
            aiRationale: aiResult.scoreRationale,
            aiRecommendations: aiResult.improvementRecommendations,
        };
        mockProjects.unshift(newProject);
    }
    
    revalidatePath("/(admin)/projects");
    revalidatePath("/(admin)/dashboard");
    if(projectId) {
      revalidatePath(`/projects/${projectId}/edit`);
    }
    revalidatePath("/(public)");

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


export async function createProductAction(formData: FormData): Promise<ProductFormState> {
    const validatedFields = productSchema.safeParse({
        titulo: formData.get("titulo"),
        descripcion: formData.get("descripcion"),
        productType: formData.get("productType"),
        isPublic: formData.get("isPublic") === 'true', // formData values are strings
        projectId: formData.get("projectId"),
    });

    if (!validatedFields.success) {
        return {
            message: "Error: Revisa los campos del formulario.",
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { projectId, ...productData } = validatedFields.data;
    const productId = formData.get("id") as string | null;
    const isEditing = !!productId;

    const project = mockProjects.find(p => p.id === projectId);
    if (!project) {
        return { message: "Error: Proyecto asociado no encontrado.", success: false };
    }

    if (isEditing) {
        const productIndex = mockProducts.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return { message: "Error: Producto no encontrado para actualizar.", success: false };
        }
        
        const existingAttachments = JSON.parse(formData.get('existingAttachments') as string || '[]') as Attachment[];
        const newAttachments = handleAttachments(formData, productId, 'PRODUCT');
        
        const updatedProduct: Product = { 
          ...mockProducts[productIndex], 
          ...productData,
          attachments: [...existingAttachments, ...newAttachments],
        };
        mockProducts[productIndex] = updatedProduct;

        const projectProductIndex = project.products.findIndex(p => p.id === productId);
        if (projectProductIndex !== -1) {
            project.products[projectProductIndex] = updatedProduct;
        }
    } else {
        const newProductId = `prod-${Date.now()}`;
        const newAttachments = handleAttachments(formData, newProductId, 'PRODUCT');

        const newProduct: Product = {
            id: newProductId,
            ...productData,
            projectId: projectId,
            createdAt: new Date(),
            attachments: newAttachments,
            imageId: `prod_${(mockProducts.length % 2) + 1}`,
        };

        mockProducts.unshift(newProduct);
        project.products.unshift(newProduct);
    }

    revalidatePath(`/(admin)/projects/${projectId}/edit`);
    revalidatePath("/(admin)/products");
    revalidatePath("/(public)");

    return {
        message: `Producto ${isEditing ? 'actualizado' : 'creado'} con éxito.`,
        success: true,
    };
}

    