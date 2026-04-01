import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Section } from '@/types/cms';
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText } from 'lucide-react';

export const AdminSections = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);

  const load = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL_API}/admin/sections`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSections(res.data.data ?? []);
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVisible = async (section: Section) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_URL_API}/admin/sections/${section.id}`,
        { visible: section.visible ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      load();
    } catch {
      /* silent */
    }
  };

  const deleteSection = async (id: number) => {
    if (!confirm('¿Eliminar esta sección y todo su contenido?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_URL_API}/admin/sections/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      load();
    } catch {
      /* silent */
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Secciones</h1>
        <button
          onClick={() => navigate('/admin/sections/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Nueva sección
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Layout</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="px-4 py-3 text-gray-500">{s.sort_order}</td>
                <td className="px-4 py-3 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: s.color_theme }}
                    />
                    {s.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                  /{s.slug}
                </td>
                <td className="px-4 py-3 text-gray-400">{s.type}</td>
                <td className="px-4 py-3 text-gray-400">{s.layout}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: s.visible ? '#16a34a33' : '#6b728033',
                      color: s.visible ? '#4ade80' : '#9ca3af',
                    }}
                  >
                    {s.visible ? 'Visible' : 'Oculto'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      title="Contenido"
                      onClick={() =>
                        navigate(`/admin/sections/${s.id}/content`)
                      }
                      className="p-1.5 hover:text-blue-400 text-gray-400 cursor-pointer"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      title={s.visible ? 'Ocultar' : 'Mostrar'}
                      onClick={() => toggleVisible(s)}
                      className="p-1.5 hover:text-yellow-400 text-gray-400 cursor-pointer"
                    >
                      {s.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      title="Editar"
                      onClick={() =>
                        navigate(`/admin/sections/${s.id}/edit`)
                      }
                      className="p-1.5 hover:text-green-400 text-gray-400 cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => deleteSection(s.id)}
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
        {sections.length === 0 && (
          <p className="text-gray-500 text-center py-8 text-sm">
            No hay secciones. Crea una nueva.
          </p>
        )}
      </div>
    </div>
  );
};
