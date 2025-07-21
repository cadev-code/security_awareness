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
    <div className="h-screen w-32 flex flex-col p-3 gap-1 border-blue-950/10 bg-black/20">
      {pages.map(({ text, url, icon: Icon }) => (
        <Link
          className="font-medium hover:bg-white/10 p-1 rounded flex gap-2 items-center"
          to={url}
        >
          <Icon size={18} />
          {text}
        </Link>
      ))}
    </div>
  );
};
