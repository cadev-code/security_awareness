import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Section } from '@/types/cms';
import { ArrowLeft } from 'lucide-react';

const ICONS = [
  'Home', 'AudioWaveform', 'Clapperboard', 'Newspaper', 'Lock',
  'ScrollText', 'BookOpen', 'Shield', 'Star', 'Layers', 'Film',
  'Headphones', 'Image', 'FileText', 'Globe',
];

const TYPES: Section['type'][] = ['video', 'podcast', 'newsletter', 'custom'];
const LAYOUTS: Section['layout'][] = ['grid', 'flex'];
const CARD_STYLES: Section['card_style'][] = ['default', 'date-badge', 'wide'];

type FormData = Omit<Section, 'id' | 'created_at' | 'visible'> & { visible: string };

const emptyForm: FormData = {
  name: '',
  slug: '',
  icon: 'Clapperboard',
  type: 'video',
  layout: 'grid',
  card_style: 'default',
  bg_image: '',
  section_logo: '',
  color_theme: '#000d04',
  items_per_page: null,
  sort_order: 0,
  visible: '1',
};

export const AdminSectionForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    axios
      .get(`${import.meta.env.VITE_URL_API}/admin/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const found: Section = (res.data.data as Section[]).find(
          (s) => s.id === Number(id),
        )!;
        if (found) {
          setForm({
            name: found.name,
            slug: found.slug,
            icon: found.icon,
            type: found.type,
            layout: found.layout,
            card_style: found.card_style,
            bg_image: found.bg_image ?? '',
            section_logo: found.section_logo ?? '',
            color_theme: found.color_theme,
            items_per_page: found.items_per_page,
            sort_order: found.sort_order,
            visible: String(found.visible),
          });
        }
      })
      .catch(() => {});
  }, [id, isEditing, token]);

  const set = (field: keyof FormData, value: string | number | null) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      visible: Number(form.visible),
      items_per_page: form.items_per_page ? Number(form.items_per_page) : null,
      sort_order: Number(form.sort_order),
      bg_image: form.bg_image || null,
      section_logo: form.section_logo || null,
    };

    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_URL_API}/admin/sections/${id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_URL_API}/admin/sections`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      navigate('/admin/sections');
    } catch {
      setError('Error al guardar. Verifica que el slug sea único.');
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
          {isEditing ? 'Editar sección' : 'Nueva sección'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) =>
                set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))
              }
              pattern="[a-z0-9\-]+"
              title="Solo letras minúsculas, números y guiones"
              required
            />
          </div>

          <div>
            <label className={labelCls}>Tipo *</label>
            <select
              className={inputCls}
              value={form.type}
              onChange={(e) => set('type', e.target.value as Section['type'])}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Ícono</label>
            <select
              className={inputCls}
              value={form.icon}
              onChange={(e) => set('icon', e.target.value)}
            >
              {ICONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Layout</label>
            <select
              className={inputCls}
              value={form.layout}
              onChange={(e) => set('layout', e.target.value as Section['layout'])}
            >
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>
                  {l === 'grid' ? 'Cuadrícula (grid)' : 'Fila (flex)'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Estilo de tarjeta</label>
            <select
              className={inputCls}
              value={form.card_style}
              onChange={(e) =>
                set('card_style', e.target.value as Section['card_style'])
              }
            >
              {CARD_STYLES.map((cs) => (
                <option key={cs} value={cs}>
                  {cs}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Color del tema (sidebar)</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                className="h-9 w-12 rounded border border-gray-700 bg-gray-800 cursor-pointer"
                value={form.color_theme}
                onChange={(e) => set('color_theme', e.target.value)}
              />
              <input
                className={inputCls}
                value={form.color_theme}
                onChange={(e) => set('color_theme', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Orden</label>
            <input
              className={inputCls}
              type="number"
              value={form.sort_order}
              onChange={(e) => set('sort_order', Number(e.target.value))}
            />
          </div>

          <div>
            <label className={labelCls}>
              Imagen de fondo{' '}
              <span className="text-gray-500">(nombre de archivo en /images/)</span>
            </label>
            <input
              className={inputCls}
              value={form.bg_image ?? ''}
              placeholder="ej: temporada2-fondo.jpg"
              onChange={(e) => set('bg_image', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>
              Logo de sección{' '}
              <span className="text-gray-500">(nombre de archivo en /images/)</span>
            </label>
            <input
              className={inputCls}
              value={form.section_logo ?? ''}
              placeholder="ej: logo-temporada2.png"
              onChange={(e) => set('section_logo', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>
              Items por página{' '}
              <span className="text-gray-500">(vacío = sin paginación)</span>
            </label>
            <input
              className={inputCls}
              type="number"
              min={1}
              value={form.items_per_page ?? ''}
              onChange={(e) =>
                set('items_per_page', e.target.value ? Number(e.target.value) : null)
              }
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
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear sección'}
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
