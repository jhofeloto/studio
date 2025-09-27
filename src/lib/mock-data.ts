
import type { User, Project, Product, UserRole, ProjectStatus, ProductType } from './definitions';

export const mockUsers: User[] = [
  { id: 'user-1', email: 'admin@ctei.com', nombre: 'Admin', apellidos: 'Nexus', role: 'ADMINISTRADOR', isActive: true, organizacion: 'CTeI' },
  { id: 'user-2', email: 'researcher@ctei.com', nombre: 'Marie', apellidos: 'Curie', role: 'INVESTIGADOR', isActive: true, organizacion: 'Universidad de la Innovación' },
  { id: 'user-3', email: 'community@ctei.com', nombre: 'Carl', apellidos: 'Sagan', role: 'COMUNIDAD', isActive: true, organizacion: 'Público General' },
];

const generateProducts = (projectId: string, count: number): Product[] => {
  const productTypes: ProductType[] = ["ART_OPEN_A1", "SF", "TES_DOC", "GEN_CONT_VIRT"];
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${projectId}-${i + 1}`,
    projectId,
    titulo: `Producto Derivado ${i + 1}`,
    descripcion: `Descripción detallada del producto derivado ${i+1} del proyecto.`,
    productType: productTypes[i % productTypes.length],
    isPublic: true,
    createdAt: new Date(),
    attachments: [],
  }));
};

export const mockProjects: Project[] = [
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
    attachments: [],
    description: '## Metodología\n\nUtilizaremos un enfoque de química computacional para predecir posibles estructuras cristalinas, seguido de síntesis en estado sólido y caracterización mediante difracción de rayos X y mediciones de resistividad.'
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
    description: '## Objetivos\n\n1.  Crear una base de datos anonimizada de IRM y datos genómicos.\n2.  Entrenar un modelo de red neuronal convolucional (CNN).\n3.  Validar el modelo con un conjunto de datos independiente.'
  },
  {
    id: 'proj-3',
    titulo: 'Plataforma de Ciencia Ciudadana para el Monitoreo de la Biodiversidad Urbana',
    resumen: 'Desarrollo de una aplicación móvil y web que permite a los ciudadanos registrar observaciones de flora y fauna en entornos urbanos, contribuyendo a una base de datos abierta para la investigación ecológica.',
    presupuesto: 300000,
    estado: 'FINALIZADO',
    entidadProponente: 'Fundación ConCiencia',
    plazo: new Date('2022-12-31'),
    isPublic: true,
    leadInvestigatorId: 'user-2',
    createdAt: new Date('2021-01-20'),
    leadInvestigator: mockUsers.find(u => u.id === 'user-2')!,
    collaborators: [],
    products: generateProducts('proj-3', 3),
    attachments: [],
    description: '## Impacto\n\nEl proyecto ha generado más de 50,000 observaciones y ha sido fundamental para la creación de dos nuevas áreas de conservación urbana.'
  },
  {
    id: 'proj-4',
    titulo: 'Tecnología Blockchain para la Trazabilidad de la Cadena de Suministro de Café',
    resumen: 'Implementación de un sistema basado en blockchain para garantizar la transparencia y trazabilidad del café de especialidad desde el productor hasta el consumidor final.',
    presupuesto: 900000,
    estado: 'EN_CURSO',
    entidadProponente: 'Cooperativa de Caficultores Tech',
    plazo: new Date('2025-08-01'),
    isPublic: false, // Private project
    leadInvestigatorId: 'user-2',
    createdAt: new Date('2023-05-01'),
    leadInvestigator: mockUsers.find(u => u.id === 'user-2')!,
    collaborators: [],
    products: generateProducts('proj-4', 1),
    attachments: [],
    description: '## Fase Actual\n\nActualmente en la fase de desarrollo del contrato inteligente y la integración con sensores IoT en las fincas piloto.'
  },
];

export const mockProducts: Product[] = mockProjects.flatMap(p => p.products);
