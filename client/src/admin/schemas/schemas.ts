import z from 'zod';

export const imageFileSchema = z
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
