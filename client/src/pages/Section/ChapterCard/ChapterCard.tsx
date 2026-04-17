import type { Chapter } from '@/types/chapter.types';

export const ChapterCard = ({ chapter }: { chapter: Chapter }) => {
  const today = new Date();

  const availabilityDate = new Date(chapter.availability);
  const formatAvailabilityDate = new Date(
    availabilityDate.getUTCFullYear(),
    availabilityDate.getUTCMonth(),
    availabilityDate.getUTCDate(),
  );

  return (
    <div
      className={`w-46 [@media(min-width:1230px)]:w-54  [@media(min-width:1360px)]:w-62 [@media(min-width:1490px)]:w-68 [@media(min-width:1660px)]:w-80 flex flex-col items-center transition-transform group ${today >= formatAvailabilityDate && 'hover:scale-[1.08] cursor-pointer'}`}
    >
      <div className="relative">
        <img
          className="w-full rounded-lg"
          src={`${import.meta.env.VITE_URL_STATIC}/covers/${chapter.cover_url}`}
          style={{ opacity: today >= formatAvailabilityDate ? '1' : '0.7' }}
          draggable={false}
        />
      </div>
    </div>
  );
};
