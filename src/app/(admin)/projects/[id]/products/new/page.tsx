import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/forms/product-form";
import { mockProjects } from "@/lib/mock-data";
import { notFound } from "next/navigation";

type Props = {
    params: { id: string };
};

export default function NewProductPage({ params }: Props) {
    const project = mockProjects.find(p => p.id === params.id);

    if (!project) {
        notFound();
    }

  return (
    <>
      <PageHeader 
        title="Añadir Nuevo Producto"
        description={`Para el proyecto: ${project.titulo}`}
      />
      <div className="max-w-4xl mx-auto">
        <ProductForm projectId={project.id} />
      </div>
    </>
  );
}
