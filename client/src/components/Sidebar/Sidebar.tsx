import { AudioWaveform, Home, LucideIcon } from 'lucide-react';
import { Link } from 'react-router';

interface Page {
  text: string;
  url: string;
  icon: LucideIcon;
}

export const Sidebar = () => {
  const pages: Page[] = [
    { text: 'Inicio', url: '/home', icon: Home },
    { text: 'Podcast', url: '/podcast', icon: AudioWaveform },
  ];

  return (
    <div className="h-screen w-32 flex flex-col justify-between p-3 border-blue-950/10">
      <div className="flex flex-col gap-1">
        {pages.map(({ text, url, icon: Icon }, i) => (
          <Link
            key={i}
            className="font-medium hover:bg-white/10 p-1 rounded flex gap-2 items-center"
            to={url}
          >
            <Icon size={18} />
            {text}
          </Link>
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
