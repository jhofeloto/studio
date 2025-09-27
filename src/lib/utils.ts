import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type ProductType } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const productTypeLabels: Record<ProductType, string> = {
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
