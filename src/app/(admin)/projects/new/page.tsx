import { ProjectForm } from "@/components/forms/project-form";
import { PageHeader } from "@/components/admin/page-header";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader 
        title="Registrar Nuevo Proyecto"
        description="Completa el formulario para añadir una nueva propuesta al sistema."
      />
      <div className="max-w-4xl mx-auto">
        <ProjectForm />
      </div>
    </>
  );
}
