import { Play } from 'lucide-react';
import { ContentItem, Section } from '@/types/cms';

const isAvailable = (availability: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const raw = new Date(availability);
  const avDate = new Date(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate());
  return today >= avDate;
};

const formatDate = (availability: string): string =>
  new Date(availability).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

const coverUrl = (section: Section, cover: string): string => {
  const base = section.type === 'newsletter'
    ? `${import.meta.env.VITE_URL_STATIC}/newsletter/covers/${cover}`
    : `${import.meta.env.VITE_URL_STATIC}/video/covers/${cover}`;
  return base;
};

export const ContentCard = ({
  item,
  section,
  onClick,
}: {
  item: ContentItem;
  section: Section;
  onClick: () => void;
}) => {
  const available = isAvailable(item.availability);
  const date = formatDate(item.availability);
  const cardStyle = section.card_style;

  if (!item.cover) {
    return null;
  }

  if (cardStyle === 'wide') {
    return (
      <div
        className={`w-46 sm:w-54 md:w-62 lg:w-68 xl:w-80 flex flex-col items-center transition-transform group ${available ? 'hover:scale-[1.08] cursor-pointer' : ''}`}
        onClick={available ? onClick : undefined}
      >
        <div className="relative w-full">
          <img
            className="w-full rounded-lg"
            src={coverUrl(section, item.cover)}
            style={{ opacity: available ? '1' : '0.5' }}
            draggable={false}
          />
        </div>
        {item.title && (
          <div className="w-full flex flex-col items-start gap-1 mt-1">
            <p
              className={`font-medium text-[18px] xl:text-[20px] select-none ${!available ? 'text-gray-300' : ''}`}
            >
              {item.title}
            </p>
            <p
              className={`font-medium text-[14px] xl:text-[16px] select-none text-cyan-100 ${!available ? 'opacity-60' : ''}`}
            >
              {date}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (cardStyle === 'date-badge') {
    return (
      <div
        className={`flex flex-col transition-transform text-[#91e6fc] hover:text-white group ${available ? 'hover:scale-[1.08] cursor-pointer' : ''}`}
        onClick={available ? onClick : undefined}
      >
        <div className="w-full relative">
          <img
            className="w-full rounded-lg"
            src={coverUrl(section, item.cover)}
            style={{ opacity: available ? '1' : '0.4' }}
            draggable={false}
          />
          {available && (
            <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pointer-events-none">
              <div className="bg-black/50 p-4 rounded-full text-white transition-opacity opacity-0 group-hover:opacity-100">
                <Play size={38} />
              </div>
            </div>
          )}
        </div>
        <div
          className={`w-fit mx-auto flex flex-col items-center px-4 py-2 bg-[#004fa1]/80 rounded-md mt-2 ${!available ? 'opacity-70' : ''}`}
        >
          {item.title && (
            <p className="font-medium text-[20px] xl:text-[24px] select-none">
              {item.title}
            </p>
          )}
          <p className="font-medium text-[14px] xl:text-[18px] select-none">
            {date}
          </p>
        </div>
      </div>
    );
  }

  // default style (e.g. Temporada 2, newsletter)
  return (
    <div
      className={`flex flex-col transition-transform hover:text-cyan-300 group ${available ? 'hover:scale-[1.08] cursor-pointer' : ''}`}
      onClick={available ? onClick : undefined}
    >
      <div className="w-full relative">
        <img
          className="w-full rounded-lg"
          src={coverUrl(section, item.cover)}
          style={{ opacity: available ? '1' : '0.4' }}
          draggable={false}
        />
        {available && (
          <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pointer-events-none">
            <div className="bg-black/50 p-4 rounded-full text-cyan-300 transition-opacity opacity-0 group-hover:opacity-100">
              <Play size={38} />
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col items-start p-2 gap-1">
        {item.title && (
          <p
            className={`font-medium text-base xl:text-xl select-none ${!available ? 'text-gray-400' : ''}`}
          >
            {item.title}
          </p>
        )}
        {section.type === 'newsletter' && (
          <p
            className={`w-full text-center font-medium text-base xl:text-xl select-none ${!available ? 'text-gray-400' : ''}`}
          >
            Disponible{' '}
            {!available ? `el ${date}` : `(${date})`}
          </p>
        )}
      </div>
    </div>
  );
};
