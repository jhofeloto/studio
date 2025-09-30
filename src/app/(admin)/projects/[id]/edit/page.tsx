
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/forms/project-form";
import { ProductsTable } from "@/components/products-table";
import { ProductForm } from "@/components/forms/product-form";
import { getProjectById } from "@/lib/data"; // <-- Use centralized data fetching

// This forces the page to be rendered dynamically and always fetch the latest data.
export const dynamic = 'force-dynamic';

export default async function ProjectEditPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id); // <-- Fetch project from the single source of truth

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProjectForm project={project} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductsTable products={project.products} />
        </div>
        <div>
          <ProductForm projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
