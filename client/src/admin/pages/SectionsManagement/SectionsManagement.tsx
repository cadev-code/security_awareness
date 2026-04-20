import { useSections } from '@/admin/hooks/useSections';

import type { Section } from '@/types/section.types';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from '@/components/ui/tooltip';

import { Image, LayoutTemplate, Pencil, Plus, Trash } from 'lucide-react';
import { SectionEditorDialog } from '@/admin/components/SectionEditorDialog/SectionEditorDialog';
import { useState } from 'react';

export const SectionsManagement = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);

  const { data: sections } = useSections();

  const columns: ColumnDef<Section>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'bg_color',
      header: 'Color de Fondo',
    },
    {
      accessorKey: 'bg_url',
      header: 'Imagen de Fondo',
      cell: ({ row }) => (
        <a
          className="text-blue-500 cursor-default"
          href={`${import.meta.env.VITE_URL_API}/static/backgrounds/${row.original.bg_url}`}
          target="_blank"
        >
          <Image className="cursor-pointer" />
        </a>
      ),
    },
    {
      accessorKey: 'flag_url',
      header: 'Imagen de Subtítulo',
      cell: ({ row }) => (
        <a
          className="text-blue-500 cursor-default"
          href={`${import.meta.env.VITE_URL_API}/static/subtitles/${row.original.flag_url}`}
          target="_blank"
        >
          <Image className="cursor-pointer" />
        </a>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-end pr-2">Acciones</div>,
      cell: () => (
        <div className="flex items-center justify-end gap-1">
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="cursor-pointer text-blue-700"
                  variant="ghost"
                  size="icon"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar sección</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="cursor-pointer text-destructive"
                  variant="ghost"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eliminar Sección</TooltipContent>
            </Tooltip>
          </>
        </div>
      ),
    },
    {
      id: 'chapters',
      header: () => <div className="text-end pr-8">Capítulos</div>,
      cell: () => (
        <div className="flex justify-end pr-2">
          <Button className="cursor-pointer" variant="ghost">
            Ver Capítulos
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: sections || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 h-screen w-screen p-8 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            Gestión de Secciones
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Administra las secciones del sistema Security Awareness.
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sección
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden w-full">
        <Table className="full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(sections || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <LayoutTemplate className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No se encontraron secciones. ¡Agrega una nueva sección para
                    comenzar!
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SectionEditorDialog
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditSection(null);
        }}
        editSection={editSection}
      />
    </div>
  );
};
