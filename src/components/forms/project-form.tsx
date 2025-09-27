"use client";

import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState, useActionState } from "react";
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
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Project } from "@/lib/definitions";

function SubmitButton({ isEditing }: { isEditing?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isEditing ? "Guardar Cambios y Re-evaluar" : "Crear Proyecto y Evaluar con IA"}
    </Button>
  );
}

type ProjectFormProps = {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  
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
      presupuesto: project.presupuesto || undefined,
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

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.message) {
        if(formState.aiResult) {
            setShowDialog(true);
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
            ref={formRef}
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
                      <Input type="number" placeholder="Ej: 500000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
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

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Visible Públicamente</FormLabel>
                      <FormDescription>
                        Permitir que este proyecto sea visible en el portal público.
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
            </div>

            <div className="flex justify-end">
              <SubmitButton isEditing={isEditing} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>

    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-primary">Evaluación por IA Completada</AlertDialogTitle>
          <AlertDialogDescription>
           {formState.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-2">
                <h3 className="font-semibold font-headline">Puntaje General</h3>
                <p className="text-3xl font-bold text-primary">{formState.aiResult?.score}/100</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold font-headline">Resumen del Proyecto</h3>
                <p className="text-sm text-muted-foreground">{formState.aiResult?.summary}</p>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold font-headline">Análisis y Racional del Puntaje</h3>
                <p className="text-sm text-muted-foreground">{formState.aiResult?.rationale}</p>
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
              if (!isEditing) {
                form.reset();
              }
              setShowDialog(false);
            }}>
            {isEditing ? "Cerrar" : "Crear Otro Proyecto"}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}