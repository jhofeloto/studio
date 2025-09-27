import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/definitions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === 'proj_1') ?? {
    imageUrl: `https://picsum.photos/seed/${project.id}/600/400`,
    imageHint: "science technology",
  };

  const statusColors = {
    PROPUESTO: "bg-blue-100 text-blue-800",
    EN_CURSO: "bg-yellow-100 text-yellow-800",
    FINALIZADO: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-800",
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image
              src={placeholder.imageUrl}
              alt={project.titulo}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
        </div>
        <div className="p-6 pb-2">
            <Badge variant="secondary" className={statusColors[project.estado]}>
                {project.estado.replace("_", " ")}
            </Badge>
            <CardTitle className="mt-2 font-headline text-lg leading-tight">
                <Link href={`/project/${project.id}`} className="hover:text-primary transition-colors">
                    {project.titulo}
                </Link>
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">{project.resumen}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <p>{project.entidadProponente}</p>
          <p>{new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
            <Link href={`/project/${project.id}`}>
                Ver más <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
