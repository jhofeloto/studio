
import type { Product } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { productTypeLabels } from "@/lib/utils";

type ProductCardProps = {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const placeholder = PlaceHolderImages.find(p => p.id === product.imageId) ?? {
        imageUrl: `https://picsum.photos/seed/${product.id}/600/400`,
        imageHint: "science technology",
    };

    return (
        <Card className="flex flex-col overflow-hidden h-full">
            <div className="relative aspect-video">
                <Image
                    src={placeholder.imageUrl}
                    alt={product.titulo}
                    fill
                    className="object-cover"
                    data-ai-hint={placeholder.imageHint}
                />
            </div>
            <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{productTypeLabels[product.productType]}</Badge>
                <CardTitle className="text-lg font-headline">{product.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground flex-grow">{product.descripcion}</p>
            </CardContent>
        </Card>
    )
}
