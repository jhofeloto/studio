
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { mockProjects } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Star } from "lucide-react";
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
    const projects = mockProjects;
  return (
    <>
      <PageHeader
        title="Gestión de Proyectos"
        description="Visualiza, crea y gestiona todos los proyectos de CTeI."
      >
        <Button asChild>
          <Link href="/projects/new">Crear Proyecto</Link>
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Investigador Principal</TableHead>
                    <TableHead className="text-right">Puntaje IA</TableHead>
                    <TableHead>
                    <span className="sr-only">Acciones</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map((project) => (
                    <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.titulo}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{project.estado.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell>{project.leadInvestigator.nombre} {project.leadInvestigator.apellidos}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                                <Star className="h-4 w-4 text-amber-400" />
                                <span className="font-bold">{project.aiScore ?? '-'}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/projects/${project.id}/edit`}>Editar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </CardContent>
      </Card>
    </>
  );
}
