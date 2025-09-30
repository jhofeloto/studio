import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, DollarSign, Folder, Users, BrainCircuit, AlertTriangle } from "lucide-react"; // Import new icons
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { ProjectStatusChart } from "@/components/admin/project-status-chart";
import { ProjectStatus } from "@/lib/definitions";
import { getProjects } from "@/lib/db"; 

export default async function DashboardPage() { 
    const projects = await getProjects(); 

    // --- Existing Calculations ---
    const totalBudget = projects.reduce((sum, project) => sum + (project.presupuesto || 0), 0);
    const activeProjectsCount = projects.filter(p => p.estado === 'EN_CURSO').length;
    const formattedTotalBudget = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(totalBudget);

    // --- New AI Score Calculations ---
    const scoredProjects = projects.filter(p => typeof p.aiScore === 'number');
    const averageAiScore = scoredProjects.length > 0 
      ? scoredProjects.reduce((sum, p) => sum + p.aiScore!, 0) / scoredProjects.length
      : 0;
    const atRiskProjectsCount = projects.filter(p => typeof p.aiScore === 'number' && p.aiScore < 50).length;


    const stats = [
      { title: "Presupuesto Total", value: formattedTotalBudget, change: "Calculado", icon: DollarSign },
      { title: "Proyectos Totales", value: projects.length.toString(), change: `${activeProjectsCount} activos`, icon: Folder },
      { title: "Puntaje IA Promedio", value: `${averageAiScore.toFixed(1)} / 100`, change: `${scoredProjects.length} evaluados`, icon: BrainCircuit },
      { title: "Proyectos en Riesgo", value: atRiskProjectsCount.toString(), change: "Puntaje IA < 50", icon: AlertTriangle },
    ];

    const recentProjects = projects.slice(0, 5);
    const projectStatusCounts = projects.reduce((acc, project) => {
      const estado = project.estado || 'PROPUESTO';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {} as Record<ProjectStatus, number>);

    const chartData = [
      { status: 'Propuesto', count: projectStatusCounts.PROPUESTO || 0 },
      { status: 'En Curso', count: projectStatusCounts.EN_CURSO || 0 },
      { status: 'Finalizado', count: projectStatusCounts.FINALIZADO || 0 },
      { status: 'Cancelado', count: projectStatusCounts.CANCELADO || 0 },
    ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Bienvenido al panel de administración de CTeI Nexus."
      >
        <Button asChild>
          <Link href="/projects/new">Nuevo Proyecto</Link>
        </Button>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
             <Card key={index}>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stat.value}</div>
               <p className="text-xs text-muted-foreground">{stat.change}</p>
             </CardContent>
           </Card>
        ))}
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Proyectos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Presupuesto</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentProjects.map((project) => (
                         <TableRow key={project.id}>
                         <TableCell>
                           <div className="font-medium">{project.titulo}</div>
                           <div className="text-sm text-muted-foreground">{project.entidadProponente}</div>
                         </TableCell>
                         <TableCell><Badge variant="outline">{project.estado ? project.estado.replace('_', ' ') : 'N/A'}</Badge></TableCell>
                         <TableCell className="text-right">{project.presupuesto ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(project.presupuesto) : '-'}</TableCell>
                       </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Resumen de Proyectos</CardTitle>
            <CardDescription>
              Distribución de proyectos por estado actual.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ProjectStatusChart data={chartData} />
          </CardContent>
        </Card>
      </div>

    </>
  );
}
