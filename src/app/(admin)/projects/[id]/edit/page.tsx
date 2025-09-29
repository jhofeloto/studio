import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/forms/project-form";
import { mockProjects, mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { ProjectProductsList } from "@/components/admin/project-products-list";

type Props = {
  params: { id: string };
};

export default function EditProjectPage({ params }: Props) {
  const project = mockProjects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  const projectProducts = mockProducts.filter(p => p.projectId === project.id);

  return (
    <>
      <PageHeader 
        title="Editar Proyecto"
        description={`Modificando los detalles del proyecto: ${project.titulo}`}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <ProjectForm project={project} />
        <ProjectProductsList products={projectProducts} projectId={project.id} />
      </div>
    </>
  );
}
