
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { createProductAction, type ProductFormState } from "@/lib/actions";
import { productSchema } from "@/lib/validations";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, UploadCloud } from "lucide-react";
import type { Product, Attachment } from "@/lib/definitions";
import { productTypeLabels } from "@/lib/utils";
import { FileItem } from "../file-item";


function SubmitButton({ isPending, isEditing }: { isPending: boolean; isEditing?: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? "Guardar Cambios" : "Crear Producto"}
    </Button>
  );
}

const attachmentToFile = (att: Attachment): File => {
  // This is a helper to display existing attachments in the FileItem component
  const file = new File([], att.originalName, { type: att.mimeType });
  Object.defineProperties(file, {
    'size': { value: att.size, writable: false },
  });
  return file;
};

type ProductFormProps = {
  product?: Product;
  projectId: string;
}

export function ProductForm({ product, projectId }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(product?.attachments || []);
  
  const isEditing = !!product;
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
    } : {
      titulo: "",
      descripcion: "",
      productType: "",
      isPublic: false,
      projectId: projectId,
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
             formData.append(key, String(value));
        }
    });

    if (isEditing) {
        formData.append('id', product.id);
    }
    
    // Append files and attachments
    formData.append('existingAttachments', JSON.stringify(existingAttachments));
    stagedFiles.forEach(file => {
        formData.append('attachments', file);
    });

    startTransition(async () => {
      const result = await createProductAction(formData);
      
      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        });
        // Redirect back to the project edit page on success.
        router.push(`/projects/${projectId}/edit`);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([name, errors]) => {
            if (errors) {
              form.setError(name as keyof z.infer<typeof productSchema>, {
                type: "manual",
                message: errors.join(", "),
              });
            }
          });
        }
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setStagedFiles(prevFiles => [...prevFiles, ...files]);
    event.target.value = "";
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments(prevAtts => prevAtts.filter((_, i) => i !== index));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isEditing ? "Editar Producto" : "Crear Nuevo Producto"}</CardTitle>
        <CardDescription>{isEditing ? "Modifica los detalles del producto." : "Rellena los detalles del nuevo producto."}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el título del producto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Producto</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                           <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de producto" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-80">
                        {Object.entries(productTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Una descripción detallada del producto..." {...field} rows={6} />
                  </FormControl>
                   <FormDescription>
                    Puedes usar Markdown para formatear el texto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormItem>
                <FormLabel>Archivos Adjuntos</FormLabel>
                <FormControl>
                    <label htmlFor="file-upload" className="relative cursor-pointer block w-full border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                        <UploadCloud className="mx-auto h-12 w-12" />
                        <span className="mt-2 block text-sm font-semibold">Haz clic para cargar o arrastra y suelta</span>
                        <span className="mt-1 block text-xs">PDF, DOCX, etc. (max. 10MB c/u)</span>
                        <Input id="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                </FormControl>
                {(stagedFiles.length > 0 || existingAttachments.length > 0) && (
                  <div className="mt-4 space-y-3">
                      {existingAttachments.map((att, index) => (
                        <FileItem 
                          key={`existing-${att.id}`} 
                          file={attachmentToFile(att)} 
                          onRemove={() => removeExistingAttachment(index)} 
                        />
                      ))}
                      {stagedFiles.map((file, index) => (
                          <FileItem 
                          key={`staged-${index}`} 
                          file={file} 
                          onRemove={() => removeStagedFile(index)} 
                        />
                      ))}
                  </div>
                )}
            </FormItem>
            
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Visible Públicamente</FormLabel>
                      <FormDescription>
                        Permitir que sea visible en el portal público.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            <div className="flex justify-end">
              <SubmitButton isPending={isPending} isEditing={isEditing} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    