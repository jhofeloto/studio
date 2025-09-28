import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/definitions";
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === project.imageId) ?? {
    imageUrl: `https://picsum.photos/seed/${project.id}/600/400`,
    imageHint: "science technology",
  };
  
  return (
    <Link href={`/project/${project.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={placeholder.imageUrl}
              alt={project.titulo}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
            <div className="absolute top-2 right-2">
                 <Badge variant="secondary">{project.estado.replace("_", " ")}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-headline font-semibold text-lg mb-2 leading-tight">{project.titulo}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{project.resumen}</p>
        </CardContent>
      </Card>
    </Link>
  );
}