
import { mockProjects } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, FlaskConical, User, Building, Paperclip, Download } from 'lucide-react';
import { ProductCard } from '@/components/public/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export default function ProjectDetailsPage({ params }: Props) {
  const project = mockProjects.find(p => p.id === params.id);

  if (!project || !project.isPublic) {
    notFound();
  }
  
  const placeholder = PlaceHolderImages.find(p => p.id === project.imageId) ?? {
    imageUrl: `https://picsum.photos/seed/${project.id}/1200/400`,
    imageHint: "science technology",
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <article>
      <header className="relative h-64 md:h-80 w-full">
        <Image
          src={placeholder.imageUrl}
          alt={project.titulo}
          fill
          className="object-cover"
          data-ai-hint={placeholder.imageHint}
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 container mx-auto flex flex-col justify-end p-6 md:p-12">
          <Badge variant="secondary" className="w-fit mb-2">
            {project.estado.replace("_", " ")}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-white shadow-lg">
            {project.titulo}
          </h1>
        </div>
      </header>
      
      <div className="container mx-auto py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className='font-headline'>Resumen del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.resumen}</p>
            </CardContent>
          </Card>

          {project.description && (
             <Card>
              <CardHeader>
                <CardTitle className='font-headline'>Descripción Detallada</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                    className="prose prose-stone dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br />') }}
                />
              </CardContent>
            </Card>
          )}

           {project.attachments.length > 0 && (
              <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Archivos Adjuntos</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {project.attachments.map(att => (
                            <li key={att.id} className="flex items-center justify-between p-3 rounded-md border">
                                <div className='flex items-center gap-3'>
                                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{att.originalName}</p>
                                        <p className="text-xs text-muted-foreground">{formatBytes(att.size)}</p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="icon">
                                    <Link href={att.url}><Download className="h-4 w-4" /></Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
              </Card>
           )}

           {project.products.length > 0 && (
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">Productos Derivados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky top-20 self-start">
           <Card>
            <CardHeader>
              <CardTitle className='font-headline text-lg'>Detalles Clave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">Presupuesto:</span>
                    <p className="text-muted-foreground">{project.presupuesto ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(project.presupuesto) : 'No especificado'}</p>
                  </div>
                </div>
                <Separator/>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">Plazo:</span>
                    <p className="text-muted-foreground">{project.plazo ? new Date(project.plazo).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No definido'}</p>
                  </div>
                </div>
                <Separator/>
                <div className="flex items-start">
                  <Building className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">Entidad Proponente:</span>
                    <p className="text-muted-foreground">{project.entidadProponente}</p>
                  </div>
                </div>
                <Separator/>
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">Investigador Principal:</span>
                    <p className="text-muted-foreground">{project.leadInvestigator.nombre} {project.leadInvestigator.apellidos}</p>
                  </div>
                </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </article>
  );
}
