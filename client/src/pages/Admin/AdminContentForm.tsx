import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { ContentItem } from '@/types/cms';
import { ArrowLeft, Upload } from 'lucide-react';

type ContentType = ContentItem['content_type'];
const CONTENT_TYPES: ContentType[] = ['video', 'audio', 'image', 'pdf'];

interface FormData {
  title: string;
  filename: string;
  cover: string;
  availability: string;
  url_questions: string;
  content_type: ContentType;
  sort_order: string;
  visible: string;
}

const emptyForm: FormData = {
  title: '',
  filename: '',
  cover: '',
  availability: new Date().toISOString().split('T')[0],
  url_questions: 'not-url',
  content_type: 'video',
  sort_order: '0',
  visible: '1',
};

export const AdminContentForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Route: /admin/sections/:id/content/new  → { id }
  // Route: /admin/sections/:sectionId/content/:itemId/edit → { sectionId, itemId }
  const params = useParams<{
    id?: string;
    sectionId?: string;
    itemId?: string;
  }>();

  const resolvedSectionId = params.sectionId ?? params.id ?? '';
  const itemId = params.itemId;
  const isEditing = !!itemId;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    axios
      .get(
        `${import.meta.env.VITE_URL_API}/admin/sections/${resolvedSectionId}/content`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        const found: ContentItem | undefined = (
          res.data.data as ContentItem[]
        ).find((item) => item.id === Number(itemId));
        if (found) {
          setForm({
            title: found.title ?? '',
            filename: found.filename,
            cover: found.cover ?? '',
            availability: found.availability.split('T')[0],
            url_questions: found.url_questions,
            content_type: found.content_type,
            sort_order: String(found.sort_order),
            visible: String(found.visible),
          });
        }
      })
      .catch(() => {});
  }, [itemId, isEditing, resolvedSectionId, token]);

  const set = (field: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (coverFile) formData.append('cover', coverFile);

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_URL_API}/admin/content/${itemId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_URL_API}/admin/sections/${resolvedSectionId}/content`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }
      navigate(`/admin/sections/${resolvedSectionId}/content`);
    } catch {
      setError('Error al guardar el contenido.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500';
  const labelCls = 'block text-sm font-medium text-gray-300 mb-1';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar contenido' : 'Nuevo contenido'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Título</label>
            <input
              className={inputCls}
              value={form.title}
              placeholder="Ej: Episodio 1 — Phishing"
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className={labelCls}>
              Nombre de archivo *{' '}
              <span className="text-gray-500 text-xs">
                (nombre en el servidor estático, ej: video1.mp4)
              </span>
            </label>
            <input
              className={inputCls}
              value={form.filename}
              placeholder="ej: video-episodio1.mp4"
              onChange={(e) => set('filename', e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Tipo de contenido</label>
            <select
              className={inputCls}
              value={form.content_type}
              onChange={(e) => set('content_type', e.target.value as ContentType)}
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Fecha de disponibilidad</label>
            <input
              className={inputCls}
              type="date"
              value={form.availability}
              onChange={(e) => set('availability', e.target.value)}
              required
            />
          </div>

          <div className="col-span-2">
            <label className={labelCls}>
              Portada (cover){' '}
              <span className="text-gray-500 text-xs">
                — sube una imagen o escribe el nombre de archivo en el servidor estático
              </span>
            </label>
            <div className="flex gap-2">
              <input
                className={`${inputCls} flex-1`}
                value={form.cover}
                placeholder="ej: cover-episodio1.jpg  (o deja vacío si subes archivo)"
                onChange={(e) => set('cover', e.target.value)}
              />
              <label className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm cursor-pointer shrink-0">
                <Upload size={14} />
                {coverFile ? coverFile.name.slice(0, 14) + '…' : 'Subir'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <label className={labelCls}>URL del cuestionario</label>
            <input
              className={inputCls}
              value={form.url_questions}
              placeholder="https://forms.office.com/..."
              onChange={(e) => set('url_questions', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Orden</label>
            <input
              className={inputCls}
              type="number"
              value={form.sort_order}
              onChange={(e) => set('sort_order', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Estado</label>
            <select
              className={inputCls}
              value={form.visible}
              onChange={(e) => set('visible', e.target.value)}
            >
              <option value="1">Visible</option>
              <option value="0">Oculto</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Agregar contenido'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
