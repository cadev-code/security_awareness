import { useEffect, useState } from 'react';
import { NavLink, useLocation, useSearchParams } from 'react-router';

import type { Section, SectionResponse } from '@/types/section.types';

import axios from 'axios';

import { Home, LucideIcon, ScrollText } from 'lucide-react';

interface Page {
  text: string;
  url: string;
  icon?: LucideIcon;
}

export const Sidebar = () => {
  const [sections, setSections] = useState<Section[]>([]);

  const getSections = async () => {
    try {
      const url = `${import.meta.env.VITE_URL_API}/sections`;
      const response = (await axios.get(url)) as SectionResponse;

      if (response.data && response.data.length > 0) {
        setSections(response.data);
      }
    } catch (error) {
      console.error('Error al obtener secciones:', error);
    }
  };

  useEffect(() => {
    getSections();
  }, []);

  const pages: Page[] = [
    { text: 'Inicio', url: '/home', icon: Home },
    { text: 'Seg. Informa', url: '/information', icon: ScrollText },
    { text: 'Temporada 1', url: '/podcast' },
    ...sections.map((section) => ({
      text: section.name,
      url: `/section?id=${section.id}`,
    })),
  ];

  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <div
      className="h-screen w-40 flex flex-col justify-between p-3 border-blue-950/10"
      style={{
        backgroundColor: location.pathname.startsWith('/section')
          ? sections.find((s) => s.id === Number(searchParams.get('id')))
              ?.bg_color
          : location.pathname === '/information'
            ? '#00092e'
            : '#000d04',
      }}
    >
      <div className="flex flex-col gap-1">
        {pages.map(({ text, url, icon: Icon }, i) => (
          <NavLink
            key={i}
            className={({ isActive }) =>
              `font-medium hover:bg-white/10 p-1 rounded flex gap-2 items-center ${isActive && 'bg-white/10'} ${!Icon && 'pl-2'}`
            }
            to={url}
          >
            {Icon && <Icon size={18} />}
            {text}
          </NavLink>
        ))}
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
