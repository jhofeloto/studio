
import { z } from 'zod';

export const projectSchema = z.object({
  titulo: z.string().min(10, { message: 'Título debe tener al menos 10 caracteres' }),
  resumen: z.string().min(50, { message: 'Resumen debe tener al menos 50 caracteres' }),
  presupuesto: z.number().positive({ message: 'El presupuesto debe ser un número positivo' }).optional(),
  estado: z.enum(['PROPUESTO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO']),
  entidadProponente: z.string().min(3, { message: 'Entidad proponente requerida' }),
  isPublic: z.boolean().default(false),
  description: z.string().optional(),
});
