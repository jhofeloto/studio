import { SearchInput } from "@/components/search-input";
import { ProjectCard } from "@/components/public/project-card";
import { ProductCard } from "@/components/public/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProjects, mockProducts } from "@/lib/mock-data";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function SearchPage() {
  const projects = mockProjects.filter(p => p.isPublic);
  const products = mockProducts.filter(p => p.isPublic);

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline ctei-gradient bg-clip-text text-transparent">
          Portal de Consulta CTeI
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Explora proyectos y productos de investigación e innovación que están transformando nuestro futuro.
        </p>
      </div>
      
      <div className="max-w-xl mx-auto mb-12">
        <SearchInput 
          placeholder="Buscar proyectos, productos, investigadores..."
        />
      </div>
      
      <Tabs defaultValue="projects" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
      </Pagination>
    </div>
  );
}
