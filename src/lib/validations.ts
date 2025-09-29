
import { z } from 'zod';

export const projectSchema = z.object({
  titulo: z.string().min(10, { message: 'Título debe tener al menos 10 caracteres' }),
  resumen: z.string().min(50, { message: 'Resumen debe tener al menos 50 caracteres' }),
  presupuesto: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive({ message: 'El presupuesto debe ser un número positivo' }).optional()
  ),
  estado: z.enum(['PROPUESTO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO']),
  entidadProponente: z.string().min(3, { message: 'Entidad proponente requerida' }),
  isPublic: z.boolean().default(false),
  description: z.string().optional(),
});

export const productSchema = z.object({
    titulo: z.string().min(5, { message: "El título debe tener al menos 5 caracteres." }),
    descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
    productType: z.string().min(1, { message: "Debes seleccionar un tipo de producto." }),
    isPublic: z.boolean().default(false),
    projectId: z.string(),
});
