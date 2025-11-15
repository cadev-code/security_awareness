import {
  AudioWaveform,
  Clapperboard,
  Home,
  Lock,
  LucideIcon,
  Newspaper,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

interface Page {
  text: string;
  url: string;
  icon: LucideIcon;
}

export const Sidebar = () => {
  const pages: Page[] = [
    { text: 'Inicio', url: '/home', icon: Home },
    { text: 'Temporada 1', url: '/temporada-1', icon: AudioWaveform },
    { text: 'Temporada 2', url: '/temporada-2', icon: Clapperboard },
    { text: 'Oct SI', url: '/oct-si', icon: Newspaper },
    { text: 'Temporada 3', url: '/temporada-3', icon: Clapperboard },
    { text: 'PSSWRD', url: '/psswrd', icon: Lock },
    { text: 'Temporada 4', url: '/temporada-4', icon: Clapperboard },
  ];

  const location = useLocation();

  return (
    <div
      className="h-screen w-40 flex flex-col justify-between p-3 border-blue-950/10"
      style={{
        backgroundColor:
          location.pathname === '/temporada-2'
            ? '#010302'
            : location.pathname === '/oct-si'
              ? '#00252e'
              : location.pathname === '/temporada-3'
                ? '#004fa1'
                : location.pathname === '/psswrd'
                  ? '#013d83'
                  : location.pathname === '/temporada-4'
                    ? '#001449'
                    : '#000d04',
      }}
    >
      <div className="flex flex-col gap-1">
        {pages.map(({ text, url, icon: Icon }, i) => (
          <NavLink
            key={i}
            className={({ isActive }) =>
              `font-medium hover:bg-white/10 p-1 rounded flex gap-2 items-center ${isActive && 'bg-white/10'}`
            }
            to={url}
          >
            <Icon size={18} />
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
