
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
};
