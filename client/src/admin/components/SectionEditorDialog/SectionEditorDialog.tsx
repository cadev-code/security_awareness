import { useEffect } from 'react';

import { Section } from '@/types/section.types';

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
import { useAddSection } from '@/admin/hooks/useAddSection';

interface Props {
  editSection: Section | null;
  isOpen: boolean;
  onClose: () => void;
}

const defaultSchema = z.object({
  name: z.string().min(3, 'Debe tener al menos 3 caracteres.'),
  bg_color: z
    .string()
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      'Debe ser un color hexadecimal.',
    ),
});

const imageFileSchema = z
  .instanceof(File, {
    message: 'Debe seleccionar un archivo de imagen.',
  })
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'El archivo debe ser menor a 5MB.',
  )
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'El archivo debe ser una imagen JPEG, PNG o WEBP.',
  );

const addSectionSchema = defaultSchema.extend({
  bg_image: imageFileSchema,
  subtitle_image: imageFileSchema,
});

export const SectionEditorDialog = ({
  editSection,
  isOpen,
  onClose,
}: Props) => {
  const isEdit = !!editSection;

  const addSection = useAddSection(onClose);
  // TODO: add updateUser hook

  const form = useForm({
    defaultValues: {
      name: '',
      bg_color: '',
      bg_image: null as File | null,
      subtitle_image: null as File | null,
    },
    validators: {
      onSubmit: addSectionSchema,
      onChange: addSectionSchema,
    },
    onSubmit: (values) => {
      if (isEdit) {
        // TODO: add updateUser.mutate
        // updateUser.mutate(
        //   {
        //     userId: editUser.id,
        //     fullname: values.value.fullname,
        //     role: values.value.role,
        //   },
        //   {
        //     onSuccess: () => {
        //       onClose();
        //     },
        //   },
        // );
      } else {
        const { bg_image, subtitle_image, ...rest } = values.value;

        if (!(bg_image instanceof File) || !(subtitle_image instanceof File)) {
          return;
        }

        addSection.mutate({
          ...rest,
          bg_image,
          subtitle_image,
        });
      }
    },
  });

  useEffect(() => {
    if (editSection) {
      form.reset({
        name: editSection.name,
        bg_color: editSection.bg_color,
        bg_image: null,
        subtitle_image: null,
      });
    } else {
      form.reset();
    }
  }, [editSection, form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Sección' : 'Nueva Sección'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? (
              <>
                Modificar los datos de <strong>{editSection.name}</strong>
              </>
            ) : (
              'Agregar una nueva sección al security awareness'
            )}
          </DialogDescription>
        </DialogHeader>
        <form
          id="section-editor"
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
                      placeholder="Nombre de la sección"
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
              name="bg_color"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Color de fondo (Hexadecimal)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="#FFFFFF"
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
              name="bg_image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Imagen de Fondo</FieldLabel>
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
              name="subtitle_image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel>Imagen de Subtítulo</FieldLabel>
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
        </form>

        <DialogFooter>
          <Button className="bg-white" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button
                type="submit"
                form="section-editor"
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
