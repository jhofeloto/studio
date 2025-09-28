import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product } from '@/lib/definitions';
import { productTypeLabels } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
   const placeholder = PlaceHolderImages.find(p => p.id === product.imageId) ?? {
    imageUrl: `https://picsum.photos/seed/${product.id}/600/400`,
    imageHint: "science technology",
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform transform-gpu hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={placeholder.imageUrl}
          alt={product.titulo}
          fill
          className="object-cover"
          data-ai-hint={placeholder.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-lg leading-snug">
          {product.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-2">
            {product.descripcion}
        </p>
      </CardContent>
      <CardFooter>
        <Badge variant="outline">{productTypeLabels[product.productType]}</Badge>
      </CardFooter>
    </Card>
  );
}
