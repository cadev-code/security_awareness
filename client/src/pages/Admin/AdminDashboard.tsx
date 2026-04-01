import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Section } from '@/types/cms';
import { Layers, FileText, Plus } from 'lucide-react';

export const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL_API}/admin/sections`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const secs: Section[] = res.data.data ?? [];
        setSections(secs);

        const entries = await Promise.all(
          secs.map(async (s) => {
            const r = await axios.get(
              `${import.meta.env.VITE_URL_API}/admin/sections/${s.id}/content`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            return [s.id, (r.data.data ?? []).length] as [number, number];
          }),
        );
        setCounts(Object.fromEntries(entries));
      } catch {
        /* silent */
      }
    };
    load();
  }, [token]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => navigate('/admin/sections/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Nueva sección
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-blue-600 transition-colors"
            onClick={() => navigate(`/admin/sections/${section.id}/content`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{section.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">/{section.slug}</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: section.visible ? '#16a34a33' : '#6b728033',
                  color: section.visible ? '#4ade80' : '#9ca3af',
                }}
              >
                {section.visible ? 'Visible' : 'Oculto'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <FileText size={14} />
                {counts[section.id] ?? '…'} items
              </span>
              <span className="flex items-center gap-1">
                <Layers size={14} />
                {section.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
