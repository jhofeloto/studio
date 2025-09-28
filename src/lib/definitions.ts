
export type UserRole = "ADMINISTRADOR" | "INVESTIGADOR" | "COMUNIDAD";

export type User = {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  organizacion?: string;
  role: UserRole;
  isActive: boolean;
};

export type ProjectStatus = "PROPUESTO" | "EN_CURSO" | "FINALIZADO" | "CANCELADO";

export type ProductType = 
  | "ART_OPEN_A1" | "LIB_A1" | "CAP_LIB_A1"
  | "PA1" | "SF" | "DI" | "EM_A"
  | "GEN_CONT_IMP" | "GEN_CONT_VIRT"
  | "TES_DOC" | "TES_MAES" | "PROY_ID_FOR";

export const ProductTypeLabels: Record<ProductType, string> = {
  ART_OPEN_A1: "Artículo A1",
  LIB_A1: "Libro A1",
  CAP_LIB_A1: "Capítulo de Libro A1",
  PA1: "Patente A1",
  SF: "Software",
  DI: "Diseño Industrial",
  EM_A: "Empresa de Base Tecnológica",
  GEN_CONT_IMP: "Contenido Impreso",
  GEN_CONT_VIRT: "Contenido Virtual",
  TES_DOC: "Tesis Doctoral",
  TES_MAES: "Tesis de Maestría",
  PROY_ID_FOR: "Proyecto Formativo",
}


export type EntityType = "PROJECT" | "PRODUCT";

export type Attachment = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  relatedId: string;
  relatedType: EntityType;
  uploadedAt: Date;
};

export type Product = {
  id: string;
  titulo: string;
  descripcion: string;
  productType: ProductType;
  projectId: string;
  isPublic: boolean;
  createdAt: Date;
  attachments: Attachment[];
  imageId: string;
};

export type Project = {
  id: string;
  titulo: string;
  resumen: string;
  presupuesto?: number;
  estado: ProjectStatus;
  entidadProponente: string;
  plazo?: Date;
  isPublic: boolean;
  leadInvestigatorId: string;
  createdAt: Date;
  leadInvestigator: User;
  collaborators: { user: User }[];
  products: Product[];
  attachments: Attachment[];
  description?: string;
  imageId: string;
  aiScore?: number;
  aiSummary?: string;
  aiRationale?: string;
  aiRecommendations?: string;
};
