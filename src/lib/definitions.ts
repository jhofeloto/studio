
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
  | "ART_OPEN_A1" | "ART_A1" | "ART_OPEN_A2" | "ART_A2" | "LIB_A1" | "LIB_A" 
  | "CAP_LIB_A1" | "CAP_LIB_A" | "PA1" | "PA2" | "MA1" | "MA2" | "VV_A1" | "VV_A2" 
  | "VA_A" | "AAD_A1" | "AAD_A" | "RNL_A" | "ART_OPEN_B" | "ART_B" | "ART_OPEN_C" 
  | "ART_C" | "LIB_B" | "CAP_LIB_B" | "PA3" | "PA4" | "MA3" | "MA4" | "VV_A3" | "VV_A4" 
  | "VA_B" | "AAD_B" | "DI_A" | "ECI" | "PP" | "PI" | "SD" | "SE" | "FIS" | "GPP_A" 
  | "GPP_B" | "FCP_A" | "FCP_B" | "EC_A" | "EC_B" | "TC_A" | "TC_B" | "TC_C" | "NSG" 
  | "ERL" | "PCD_A1" | "PCD_A2";

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

