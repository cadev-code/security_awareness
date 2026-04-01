import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { NavLink, useLocation, useSearchParams } from 'react-router';
import axios from 'axios';
import { Section } from '@/types/cms';

const getIcon = (name: string): Icons.LucideIcon => {
  const icon = (Icons as Record<string, unknown>)[name] as Icons.LucideIcon | undefined;
  return icon ?? Icons.Clapperboard;
};

const getSectionUrl = (section: Section): string => {
  if (section.type === 'custom') return `/${section.slug}`;
  return `/sections/${section.slug}`;
};

export const Sidebar = () => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API}/sections`)
      .then((r) => setSections(r.data.data ?? []))
      .catch(() => {});
  }, []);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const activeSection = sections.find((s) => {
    const url = getSectionUrl(s);
    return location.pathname === url || location.pathname.startsWith(url + '/');
  });

  // Re-render sidebar when page query param changes so bg color updates
  const _page = searchParams.get('page');
  const bgColor = activeSection?.color_theme ?? '#000d04';

  return (
    <div
      className="h-screen w-40 flex flex-col justify-between p-3 border-blue-950/10 transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
      data-page={_page}
    >
      <div className="flex flex-col gap-1">
        {sections.map((section) => {
          const Icon = getIcon(section.icon);
          const url = getSectionUrl(section);
          return (
            <NavLink
              key={section.id}
              className={({ isActive }) =>
                `font-medium hover:bg-white/10 p-1 rounded flex gap-2 items-center ${isActive ? 'bg-white/10' : ''}`
              }
              to={url}
            >
              <Icon size={18} />
              {section.name}
            </NavLink>
          );
        })}
      </div>
      <div className="text-xs text-gray-400 select-none">
        <p>© Julio 2025</p>
        <p>Seguridad de la Información.</p>
        <p>SmartCenter.</p>
        <p>Todos los derechos reservados.</p>
      </div>
    </div>
  );
};
