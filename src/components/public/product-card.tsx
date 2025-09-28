import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/definitions";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { productTypeLabels } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === product.imageId) ?? {
    imageUrl: `https://picsum.photos/seed/${product.id}/600/400`,
    imageHint: "document paper",
  };

  return (
    <Link href="#" className="group block">
      <Card className="h-full overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={placeholder.imageUrl}
              alt={product.titulo}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
           <Badge variant="outline" className="mb-2">{productTypeLabels[product.productType] || product.productType}</Badge>
          <h3 className="font-headline font-semibold text-lg leading-tight">{product.titulo}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}