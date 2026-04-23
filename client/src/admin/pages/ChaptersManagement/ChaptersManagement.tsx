import { ChapterEditorDialog } from '@/admin/components/ChapterEditorDialog/ChapterEditorDialog';
import { DeleteConfirmDialog } from '@/admin/components/DeleteConfirmDialog/DeleteConfirmDialog';
import { formatDate } from '@/admin/helpers/formatDate';
import { useChaptersBySection } from '@/admin/hooks/useChaptersBySection';
import { useSectionById } from '@/admin/hooks/useSectionById';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Chapter } from '@/types/chapter.types';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowLeft,
  Image,
  LayoutTemplate,
  Link2Off,
  Plus,
  Puzzle,
  SquareArrowOutUpRight,
  Trash,
  Video,
  Volume2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export const ChaptersManagement = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('sectionId') || '0';

  const navigate = useNavigate();

  const { data: section, isLoading } = useSectionById(Number(sectionId));
  const { data: chapters } = useChaptersBySection(Number(sectionId));

  useEffect(() => {
    if (sectionId === '0' || (sectionId !== '0' && !section && !isLoading)) {
      navigate('/admin/sections-management');
    }
  }, [sectionId, navigate, section, isLoading]);

  const columns: ColumnDef<Chapter>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'file_type',
      header: 'Tipo de archivo',
      cell: ({ row }) => (
        <>
          {row.original.file_type === 'IMAGE'
            ? 'Imagen'
            : row.original.file_type === 'VIDEO'
              ? 'Video'
              : 'Audio'}
        </>
      ),
    },
    {
      accessorKey: 'cover_url',
      header: 'Portada',
      cell: ({ row }) => (
        <a
          className="text-blue-500 cursor-default"
          href={`${import.meta.env.VITE_URL_API}/static/covers/${row.original.cover_url}`}
          target="_blank"
        >
          <Image className="cursor-pointer" />
        </a>
      ),
    },
    {
      accessorKey: 'file_url',
      header: 'Capítulo',
      cell: ({ row }) => (
        <a
          className="text-green-500 cursor-default"
          href={`${import.meta.env.VITE_URL_API}/static/chapters/${row.original.file_url}`}
          target="_blank"
        >
          {row.original.file_type === 'IMAGE' ? (
            <Image className="cursor-pointer" />
          ) : row.original.file_type === 'VIDEO' ? (
            <Video className="cursor-pointer" />
          ) : (
            <Volume2 />
          )}
        </a>
      ),
    },
    {
      accessorKey: 'availability',
      header: 'Disponibilidad',
      cell: ({ row }) => <>{formatDate(String(row.original.availability))}</>,
    },
    {
      accessorKey: 'questions_url',
      header: 'URL Preguntas',
      cell: ({ row }) =>
        row.original.questions_url === 'not-url' ? (
          <Link2Off size={20} />
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <a
                className="text-blue-600 cursor-default"
                href={row.original.questions_url}
                target="_blank"
              >
                <SquareArrowOutUpRight className="cursor-pointer" size={20} />
              </a>
            </TooltipTrigger>
            <TooltipContent>{row.original.questions_url}</TooltipContent>
          </Tooltip>
        ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteConfirmDialog
                deleteBtn={
                  <Button
                    className="cursor-pointer text-destructive"
                    variant="ghost"
                    size="icon"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                }
                item={row.original.name}
                // TODO: agregar on confirm para eliminar capítulo
                onConfirm={() => {}}
              />
            </TooltipTrigger>
            <TooltipContent>Eliminar Sección</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: chapters || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 h-screen w-screen p-8 bg-white">
      <div>
        <Button
          variant="link"
          onClick={() => navigate('/admin/sections-management')}
        >
          <ArrowLeft />
          Regresar a Secciones
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-primary" />
            Gestión de Capítulos
          </h2>
          <p className="text-lg mt-1">
            Sección: <strong>{section?.name}</strong>
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Capítulo
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
            {(chapters || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <LayoutTemplate className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No se encontraron capítulos para esta sección. ¡Agrega un
                    nuevo capítulo para comenzar!
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

      <ChapterEditorDialog
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
        }}
      />
    </div>
  );
};
