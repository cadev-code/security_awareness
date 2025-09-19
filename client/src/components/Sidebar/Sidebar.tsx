import { AudioWaveform, Clapperboard, Home, LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
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
  ];

  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  return (
    <div
      className="h-screen w-40 flex flex-col justify-between p-3 border-blue-950/10"
      style={{
        backgroundColor:
          location.pathname === '/temporada-2' ? '#010302' : '#000d04',
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
        <p>© 2025</p>
        <p>Seguridad de la Información.</p>
        <p>SmartCenter.</p>
        <p>Todos los derechos reservados.</p>
      </div>
    </div>
  );
};
