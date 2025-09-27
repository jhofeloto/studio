import Link from "next/link";
import type { Product } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  const productTypeLabels: Record<string, string> = {
    ART_OPEN_A1: "Artículo",
    LIB_A1: "Libro",
    CAP_LIB_A1: "Capítulo de Libro",
    PA1: "Patente",
    SF: "Software",
    DI: "Diseño Industrial",
    EM_A: "Empresa de Base Tecnológica",
    GEN_CONT_IMP: "Contenido Impreso",
    GEN_CONT_VIRT: "Contenido Virtual",
    TES_DOC: "Tesis Doctoral",
    TES_MAES: "Tesis de Maestría",
    PROY_ID_FOR: "Proyecto de Formación",
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <Badge variant="outline">{productTypeLabels[product.productType] || product.productType}</Badge>
        <CardTitle className="mt-2 font-headline text-lg leading-tight">
            {product.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-4">{product.descripcion}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end items-center">
        <Button variant="ghost" size="sm" asChild>
          {/* Products might have their own pages in the future */}
          <Link href={`/project/${product.projectId}`}>
            Ver proyecto <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
