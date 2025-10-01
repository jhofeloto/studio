
"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { createProductAction, type ProductFormState } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/lib/definitions";
import { productTypeLabels } from "@/lib/utils";

function SubmitButton({ isEditing }: { isEditing?: boolean }) {
  return (
    <Button type="submit" className="w-full sm:w-auto">
      {isEditing ? "Guardar Cambios" : "Crear Producto"}
    </Button>
  );
}

type ProductFormProps = {
  product?: Product;
  projectId: string;
}

const initialState: ProductFormState = { message: '', errors: null, fields: null };

export function ProductForm({ product, projectId }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, formAction] = useFormState(createProductAction, initialState);
  
  const isEditing = !!product;

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          title: "Error de Validación",
          description: state.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: state.message,
        });
        // On successful creation, redirect back to the project edit page
        router.push(`/projects/${projectId}/edit`);
      }
    }
  }, [state, router, toast, projectId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isEditing ? "Editar Producto" : "Crear Nuevo Producto"}</CardTitle>
        <CardDescription>{isEditing ? "Modifica los detalles del producto." : "Rellena los detalles del nuevo producto derivado."}</CardDescription>
      </CardHeader>
      <CardContent>
          <form
            action={formAction}
            className="space-y-8"
          >
            <input type="hidden" name="projectId" value={projectId} />
            {isEditing && <input type="hidden" name="id" value={product.id} />}

            <div className="space-y-2">
              <label htmlFor="titulo" className="font-medium">Título del Producto</label>
              <Input id="titulo" name="titulo" placeholder="Ej: Artículo científico sobre IA" defaultValue={state.fields?.titulo || product?.titulo} />
              {state.errors?.titulo && <p className="text-sm text-destructive">{state.errors.titulo.join(', ')}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="tipo" className="font-medium">Tipo de Producto</label>
              <Select name="tipo" defaultValue={state.fields?.tipo || product?.tipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de producto" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {Object.entries(productTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.tipo && <p className="text-sm text-destructive">{state.errors.tipo.join(', ')}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="descripcion" className="font-medium">Descripción</label>
              <Textarea id="descripcion" name="descripcion" placeholder="Una descripción detallada del producto..." rows={6} defaultValue={state.fields?.descripcion || product?.descripcion} />
               {state.errors?.descripcion && <p className="text-sm text-destructive">{state.errors.descripcion.join(', ')}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="url" className="font-medium">URL del Producto (Opcional)</label>
                <Input id="url" name="url" placeholder="https://ejemplo.com/producto..." defaultValue={state.fields?.url || product?.url} />
                {state.errors?.url && <p className="text-sm text-destructive">{state.errors.url.join(', ')}</p>}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <label htmlFor="isPublic" className="font-medium">Visible Públicamente</label>
                    <p className="text-sm text-muted-foreground">Permitir que sea visible en el portal público.</p>
                </div>
                <Switch id="isPublic" name="isPublic" defaultChecked={state.fields?.isPublic || product?.isPublic} />
            </div>

            <div className="flex justify-end">
              <SubmitButton isEditing={isEditing} />
            </div>
          </form>
      </CardContent>
    </Card>
  );
}
