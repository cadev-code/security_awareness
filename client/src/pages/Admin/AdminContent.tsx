import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Section, ContentItem } from '@/types/cms';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const AdminContent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [section, setSection] = useState<Section | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);

  const load = async () => {
    try {
      const [secRes, itemsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_URL_API}/admin/sections`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          `${import.meta.env.VITE_URL_API}/admin/sections/${id}/content`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ]);
      const found: Section | undefined = (secRes.data.data as Section[]).find(
        (s) => s.id === Number(id),
      );
      setSection(found ?? null);
      setItems(itemsRes.data.data ?? []);
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const toggleVisible = async (item: ContentItem) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL_API}/admin/content/${item.id}`,
        { visible: item.visible ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      load();
    } catch {
      /* silent */
    }
  };

  const deleteItem = async (itemId: number) => {
    if (!confirm('¿Eliminar este contenido?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL_API}/admin/content/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      load();
    } catch {
      /* silent */
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/sections')}
          className="text-gray-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {section?.name ?? 'Contenido'}
          </h1>
          {section && (
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              /{section.slug} · {section.type} · {section.layout}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate(`/admin/sections/${id}/content/new`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Agregar contenido
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Título</th>
              <th className="text-left px-4 py-3">Archivo</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Disponibilidad</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-800/50 hover:bg-gray-800/30"
              >
                <td className="px-4 py-3 text-gray-500">{item.sort_order}</td>
                <td className="px-4 py-3 font-medium text-white">
                  {item.title ?? <span className="text-gray-500 italic">sin título</span>}
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs max-w-40 truncate">
                  {item.filename}
                </td>
                <td className="px-4 py-3 text-gray-400">{item.content_type}</td>
                <td className="px-4 py-3 text-gray-400">
                  {formatDate(item.availability)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: item.visible ? '#16a34a33' : '#6b728033',
                      color: item.visible ? '#4ade80' : '#9ca3af',
                    }}
                  >
                    {item.visible ? 'Visible' : 'Oculto'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      title={item.visible ? 'Ocultar' : 'Mostrar'}
                      onClick={() => toggleVisible(item)}
                      className="p-1.5 hover:text-yellow-400 text-gray-400 cursor-pointer"
                    >
                      {item.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      title="Editar"
                      onClick={() =>
                        navigate(
                          `/admin/sections/${id}/content/${item.id}/edit`,
                        )
                      }
                      className="p-1.5 hover:text-green-400 text-gray-400 cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 hover:text-red-400 text-gray-400 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="text-gray-500 text-center py-8 text-sm">
            No hay contenido. Agrega el primero.
          </p>
        )}
      </div>
    </div>
  );
};
