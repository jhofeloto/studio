import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/forms/project-form";
import { mockProjects } from "@/lib/mock-data";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function EditProjectPage({ params }: Props) {
  const project = mockProjects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageHeader 
        title="Editar Proyecto"
        description={`Modificando los detalles del proyecto: ${project.titulo}`}
      />
      <div className="max-w-4xl mx-auto">
        <ProjectForm project={project} />
      </div>
    </>
  );
}
