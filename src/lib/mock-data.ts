
import type { User, Project, Product, EntityType, Attachment } from './definitions';

export const mockUsers: User[] = [
  { id: 'user-1', email: 'admin@ctei.com', nombre: 'Admin', apellidos: 'Nexus', role: 'ADMINISTRADOR', isActive: true, organizacion: 'CTeI' },
  { id: 'user-2', email: 'researcher@ctei.com', nombre: 'Marie', apellidos: 'Curie', role: 'INVESTIGADOR', isActive: true, organizacion: 'Universidad de la Innovación' },
  { id: 'user-3', email: 'community@ctei.com', nombre: 'Carl', apellidos: 'Sagan', role: 'COMUNIDAD', isActive: true, organizacion: 'Público General' },
];

const generateAttachments = (relatedId: string, relatedType: EntityType, count: number): Attachment[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `att-${relatedId}-${i+1}`,
    filename: `documento-anexo-${i+1}.pdf`,
    originalName: `Anexo Importante ${i+1}.pdf`,
    mimeType: 'application/pdf',
    size: (i + 1) * 350 * 1024, // size in bytes
    url: '#',
    relatedId,
    relatedType,
    uploadedAt: new Date(),
  }));
}

const generateProducts = (projectId: string, count: number): Product[] => {
  const productTypes: any[] = ["ART_OPEN_A1", "PI", "TC_A", "PCD_A1"];
  return Array.from({ length: count }, (_, i) => {
    const productId = `prod-${projectId}-${i + 1}`;
    return {
      id: productId,
      projectId,
      titulo: `Producto Derivado ${i + 1}`,
      descripcion: `Descripción detallada del producto derivado ${i+1} del proyecto.`,
      tipo: productTypes[i % productTypes.length],
      isPublic: true,
      status: 'PENDIENTE',
    }
  });
};

const initialMockProjects: Project[] = [
  {
    id: 'proj-1',
    titulo: 'Desarrollo de un Nuevo Material Superconductor a Temperatura Ambiente',
    resumen: 'Este proyecto busca sintetizar y caracterizar un material que exhiba superconductividad a temperatura y presión ambiental, revolucionando la transmisión de energía y la computación.',
    presupuesto: 1500000,
    estado: 'EN_CURSO',
    entidadProponente: 'Universidad de la Innovación',
    plazo: new Date('2026-12-31'),
    isPublic: true,
    leadInvestigatorId: 'user-2',
    createdAt: new Date('2023-01-15'),
    leadInvestigator: mockUsers.find(u => u.id === 'user-2')!,
    collaborators: [],
    products: generateProducts('proj-1', 2),
    attachments: generateAttachments('proj-1', 'PROYECTO', 2),
    description: '## Metodología\n\nUtilizaremos un enfoque de química computacional para predecir posibles estructuras cristalinas, seguido de síntesis en estado sólido y caracterización mediante difracción de rayos X y mediciones de resistividad.',
    imageId: 'proj_1',
    aiScore: 95,
    aiSummary: 'Proyecto altamente innovador con potencial disruptivo en energía y computación. La metodología es sólida y combina simulación con trabajo experimental.',
    aiRationale: 'El puntaje se debe al alto grado de innovación, el claro potencial de impacto tecnológico y un equipo de investigación con experiencia demostrada. La principal debilidad es el alto riesgo inherente a la investigación fundamental.',
    aiRecommendations: '1. Detallar un plan de contingencia para la fase de síntesis. 2. Ampliar la colaboración con un centro de supercomputación para acelerar los cálculos. 3. Incluir un análisis de impacto económico preliminar.',
  },
  {
    id: 'proj-2',
    titulo: 'Inteligencia Artificial para el Diagnóstico Temprano de Enfermedades Neurodegenerativas',
    resumen: 'Aplicación de modelos de aprendizaje profundo para analizar imágenes de resonancia magnética (IRM) y datos genómicos, con el fin de identificar biomarcadores para el diagnóstico precoz del Alzheimer.',
    presupuesto: 750000,
    estado: 'PROPUESTO',
    entidadProponente: 'Centro de Investigación en Salud Digital',
    plazo: new Date('2027-06-30'),
    isPublic: true,
    leadInvestigatorId: 'user-2',
    createdAt: new Date('2024-03-10'),
    leadInvestigator: mockUsers.find(u => u.id === 'user-2')!,
    collaborators: [],
    products: generateProducts('proj-2', 1),
    attachments: [],
    description: '## Objetivos\n\n1.  Crear una base de datos anonimizada de IRM y datos genómicos.\n2.  Entrenar un modelo de red neuronal convolucional (CNN).\n3.  Validar el modelo con un conjunto de datos independiente.',
    imageId: 'proj_2',
    aiScore: 88,
    aiSummary: 'Propuesta sólida que aplica IA a un problema de salud relevante. El enfoque es claro y los objetivos son medibles.',
    aiRationale: 'El proyecto está bien estructurado y utiliza tecnología de punta. El puntaje refleja un ligero riesgo en la adquisición de datos y la necesidad de una validación clínica robusta.',
    aiRecommendations: '1. Fortalecer los convenios para el acceso a datos de pacientes. 2. Detallar el protocolo de validación clínica del modelo de IA. 3. Considerar la inclusión de un experto en ética de datos en el equipo.',
  },
];


// This is a workaround to persist the mock data in development across hot reloads.
// In a real application, this would be a database.
declare global {
    // eslint-disable-next-line no-var
    var __mockProjects__: Project[];
}

if (process.env.NODE_ENV !== 'production') {
    if (!global.__mockProjects__) {
        console.log("Initializing mock projects data for development...");
        global.__mockProjects__ = initialMockProjects;
    }
}

export const mockProjects: Project[] = process.env.NODE_ENV === 'production' 
    ? initialMockProjects 
    : global.__mockProjects__;


export const mockProducts: Product[] = mockProjects.flatMap(p => p.products);
