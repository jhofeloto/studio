
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/forms/project-form";
import { ProjectProductsList } from "@/components/admin/project-products-list";
import { getProjectById } from "@/lib/data";

// This forces the page to be rendered dynamically and always fetch the latest data.
export const dynamic = 'force-dynamic';

export default async function ProjectEditPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProjectForm project={project} />
      
      {/* This single component handles both displaying and adding products */}
      <ProjectProductsList products={project.products} projectId={project.id} />
    </div>
  );
}
