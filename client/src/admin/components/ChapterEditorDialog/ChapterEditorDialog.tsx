import { useForm } from '@tanstack/react-form';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from '@/components/ui/dialog';
import {
  FieldGroup,
  FieldLabel,
  FieldError,
  Field,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { imageFileSchema } from '@/admin/schemas/schemas';
import { useAddChapter } from '@/admin/hooks/useAddChapter';
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, 'Debe tener al menos 3 caracteres.'),
  availability: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Debe ser una fecha válida en formato YYYY-MM-DD.',
    ),
  questions_url: z
    .string()
    .regex(/^https?:\/\/.+/, 'Debe ser una URL válida.')
    .or(z.literal('')),
  cover_image: imageFileSchema,
  file: z
    .instanceof(File, {
      message: 'Debe seleccionar un archivo.',
    })
    .refine(
      (file) => file.size < 600 * 1024 * 1024,
      'El archivo debe ser menor a 600MB.',
    )
    .refine(
      (file) =>
        [
          'image/jpeg',
          'image/png',
          'image/webp',
          'video/mp4',
          'audio/mpeg',
        ].includes(file.type),
      'El archivo debe ser una imagen JPEG, PNG o WEBP, un video MP4 o un audio MP3.',
    ),
});

export const ChapterEditorDialog = ({ isOpen, onClose }: Props) => {
  const [searchParams] = useSearchParams();

  const addChapter = useAddChapter(onClose);

  const form = useForm({
    defaultValues: {
      name: '',
      availability: new Date().toISOString().split('T')[0],
      questions_url: '',
      cover_image: null as File | null,
      file: null as File | null,
    },
    validators: {
      onSubmit: formSchema,
      onChange: formSchema,
    },
    onSubmit: (values) => {
      const { cover_image, file, ...rest } = values.value;

      const sectionId = searchParams.get('sectionId');

      if (!sectionId) {
        return;
      }

      if (!(cover_image instanceof File) || !(file instanceof File)) {
        return;
      }

      addChapter.mutate({
        ...rest,
        availability: new Date(`${rest.availability}T00:00:00`),
        cover_image,
        file,
        sectionId: Number(searchParams.get('sectionId')),
      });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Capítulo</DialogTitle>
          <DialogDescription>
            Agregar un nuevo capítulo al curso
          </DialogDescription>
        </DialogHeader>
        <form
          id="chapter-editor"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Nombre del capítulo"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="availability"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Disponibilidad</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="questions_url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Nombre</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="URL de las preguntas (opcional)"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="cover_image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Imagen de Portada</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        field.handleChange(
                          e.target.files ? e.target.files[0] : null,
                        )
                      }
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="file"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Archivo de Capítulo</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,audio/mpeg,audio/mp3"
                      onChange={(e) =>
                        field.handleChange(
                          e.target.files ? e.target.files[0] : null,
                        )
                      }
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button className="bg-white" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button
                type="submit"
                form="chapter-editor"
                disabled={!canSubmit} // deshabilitado si el form NO es válido
              >
                Guardar
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
