import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Project } from '@/lib/definitions';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === project.imageId) ?? {
    imageUrl: `https://picsum.photos/seed/${project.id}/600/400`,
    imageHint: "science technology",
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform transform-gpu hover:shadow-lg hover:-translate-y-1">
      <Link href={`/project/${project.id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={placeholder.imageUrl}
            alt={project.titulo}
            fill
            className="object-cover"
            data-ai-hint={placeholder.imageHint}
          />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-snug">
          <Link href={`/project/${project.id}`} className="hover:text-primary transition-colors">
            {project.titulo}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {project.resumen}
        </p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
          <Badge variant="secondary">{project.estado.replace("_", " ")}</Badge>
           <p className="text-xs text-muted-foreground">
            por {project.entidadProponente}
          </p>
      </CardFooter>
    </Card>
  );
}
