import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/forms/product-form";
import { mockProjects, mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";

type Props = {
    params: { id: string, productId: string };
};

export default function EditProductPage({ params }: Props) {
    const project = mockProjects.find(p => p.id === params.id);
    const product = mockProducts.find(p => p.id === params.productId);

    if (!project || !product || product.projectId !== project.id) {
        notFound();
    }

  return (
    <>
      <PageHeader 
        title="Editar Producto"
        description={`Modificando el producto: ${product.titulo}`}
      />
      <div className="max-w-4xl mx-auto">
        <ProductForm product={product} projectId={project.id} />
      </div>
    </>
  );
}
