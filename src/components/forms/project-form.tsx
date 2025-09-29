

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useToast } from "@/hooks/use-toast";

import { createProjectAction, updateProjectAction, type FormState } from "@/lib/actions";
import { projectSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Eye, Loader2, Star, UploadCloud } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Project, Attachment } from "@/lib/definitions";
import { FileItem } from "../file-item";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

function SubmitButton({ isEditing }: { isEditing?: boolean }) {
  const { pending } = useActionState(updateProjectAction, { message: "" });
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isEditing ? "Guardar y Re-evaluar" : "Crear y Evaluar con IA"}
    </Button>
  );
}

type ProjectFormProps = {
  project?: Project;
}

// Helper to create a File object from an Attachment, for consistent display
const attachmentToFile = (att: Attachment): File => {
  const file = new File([], att.originalName, { type: att.mimeType });
  // We add custom properties to match the structure we need
  Object.defineProperties(file, {
    'size': { value: att.size, writable: false },
  });
  return file;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const { toast } = useToast();
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(project?.attachments || []);
  
  const isEditing = !!project;

  const action = isEditing ? updateProjectAction : createProjectAction;

  const [formState, formAction] = useActionState<FormState, FormData>(action, {
    message: "",
  });
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      ...project,
      titulo: project.titulo,
      resumen: project.resumen,
      presupuesto: project.presupuesto,
      description: project.description || "",
    } : {
      titulo: "",
      resumen: "",
      presupuesto: undefined,
      estado: "PROPUESTO",
      entidadProponente: "",
      isPublic: false,
      description: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setStagedFiles(prevFiles => [...prevFiles, ...files]);
    // Clear the input value to allow selecting the same file again
    event.target.value = "";
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments(prevAtts => prevAtts.filter((_, i) => i !== index));
  }

  useEffect(() => {
    if (formState.message) {
        if(formState.aiResult) {
            setShowResultDialog(true);
        } else {
             toast({
                title: "Error",
                description: formState.message,
                variant: "destructive",
            });
        }
    }
    if (formState.errors) {
      Object.entries(formState.errors).forEach(([name, errors]) => {
        if (errors) {
          form.setError(name as keyof z.infer<typeof projectSchema>, {
            type: "manual",
            message: errors.join(", "),
          });
        }
      });
    }
  }, [formState, form, toast]);

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isEditing ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</CardTitle>
        <CardDescription>{isEditing ? "Modifica los detalles de la propuesta." : "Rellena los detalles de tu propuesta de CTeI."}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-8"
          >
            {isEditing && <input type="hidden" name="id" value={project.id} />}
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el título..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen (Abstract)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Un breve resumen del proyecto..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="presupuesto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuesto (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 500000" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entidadProponente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entidad Proponente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Universidad de la Innovación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Detallada</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe en detalle el proyecto, metodología, objetivos, etc." {...field} rows={8} />
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
                        <Input id="file-upload" name="attachments" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                </FormControl>
                <FormDescription>
                    {stagedFiles.length > 0 || existingAttachments.length > 0 ? 'Archivos listos para el proyecto.' : 'Aquí podrás adjuntar documentos relevantes para tu propuesta.'}
                </FormDescription>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <div>
                           <input type="hidden" name={field.name} value={field.value} />
                           <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PROPUESTO">Propuesto</SelectItem>
                        <SelectItem value="EN_CURSO">En Curso</SelectItem>
                        <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <FormItem>
                  <FormLabel>Puntaje IA Actual</FormLabel>
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                      <Star className="h-4 w-4 mr-2 text-amber-400" />
                      <span className="font-bold">{project.aiScore ?? '-'} / 100</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Ver Evaluación de IA">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-headline text-2xl text-primary">Última Evaluación de IA</DialogTitle>
                          <DialogDescription>
                            Este es el análisis más reciente generado para el proyecto.
                          </DialogDescription>
                        </DialogHeader>
                         <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 mt-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold font-headline">Puntaje General</h3>
                                <p className="text-3xl font-bold text-primary">{project.aiScore ?? 'N/A'}/100</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold font-headline">Resumen del Proyecto</h3>
                                <p className="text-sm text-muted-foreground">{project.aiSummary ?? 'No disponible.'}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold font-headline">Análisis del Puntaje</h3>
                                <p className="text-sm text-muted-foreground">{project.aiRationale ?? 'No disponible.'}</p>
                            </div>
                             <div className="space-y-2">
                                <h3 className="font-semibold font-headline">Recomendaciones de Mejora</h3>
                                <p className="text-sm text-muted-foreground">{project.aiRecommendations ?? 'No disponible.'}</p>
                            </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                   <FormDescription>
                    El puntaje se recalculará al guardar.
                  </FormDescription>
                </FormItem>
              )}

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 h-full">
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
                        name="isPublic"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <SubmitButton isEditing={isEditing} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>

    <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-primary">Evaluación por IA Completada</AlertDialogTitle>
          <AlertDialogDescription>
           {formState.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-2">
                <h3 className="font-semibold font-headline">Puntaje Obtenido</h3>
                <p className="text-3xl font-bold text-primary">{formState.aiResult?.score}/100</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold font-headline">Resumen del Proyecto</h3>
                <p className="text-sm text-muted-foreground">{formState.aiResult?.summary}</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold font-headline">Análisis del Puntaje</h3>
                <p className="text-sm text-muted-foreground">{formState.aiResult?.scoreRationale}</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold font-headline">Recomendaciones de Mejora</h3>
                <p className="text-sm text-muted-foreground">{formState.aiResult?.improvementRecommendations}</p>
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
              if (!isEditing) {
                form.reset();
                setStagedFiles([]);
                setExistingAttachments([]);
              }
              setShowResultDialog(false);
            }}>
            {isEditing ? "Cerrar" : "Crear Otro Proyecto"}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
