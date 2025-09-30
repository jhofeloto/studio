
import { Activity, ArrowUpRight, CreditCard, DollarSign, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProjects } from "@/lib/data"; // <-- Use centralized data fetching
import Link from "next/link";

// This forces the page to be rendered dynamically and always fetch the latest data.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const projects = await getProjects(); // <-- Fetch projects from the single source of truth
  const recentProjects = projects.slice(0, 5);

  // Calculate stats based on fresh data
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.presupuesto || 0), 0);
  const averageScore = projects.length > 0 
    ? projects.reduce((sum, p) => sum + (p.aiScore || 0), 0) / projects.length
    : 0;

  return (
    <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Propuestas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">Proyectos en la plataforma</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Sumatoria de presupuestos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Puntaje IA Promedio</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Puntaje promedio de proyectos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actividad Reciente</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5</div>
              <p className="text-xs text-muted-foreground">Nuevas propuestas esta semana</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Propuestas Recientes</CardTitle>
                <CardDescription>Las 5 propuestas añadidas más recientemente.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/projects">
                  Ver Todas
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investigador</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Puntaje IA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="font-medium">{project.titulo}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {project.leadInvestigator.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-xs" variant="outline">
                          {project.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{project.aiScore?.toFixed(1) ?? 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Investigadores Recientes</CardTitle>
              <CardDescription>Los usuarios que se han unido recientemente.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
                {/* This part can be dynamic in a real app */}
                <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">Olivia Martin</p>
                        <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+1,999.00</div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
