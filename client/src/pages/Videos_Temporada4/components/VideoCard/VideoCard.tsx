import { Video } from '../../Videos_Temporada4';

export const VideoCard = ({ data }: { data: Video }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset hours to compare only dates

  const availabilityDate = new Date(data.availability);
  availabilityDate.setHours(0, 0, 0, 0); // Reset hours to compare only dates

  const formatDate = new Date(data.availability).toLocaleDateString('es-Es', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

  return (
    <div
      className={`w-46 [@media(min-width:1230px)]:w-54  [@media(min-width:1360px)]:w-62 [@media(min-width:1490px)]:w-68 [@media(min-width:1660px)]:w-80 flex flex-col items-center transition-transform group ${today >= availabilityDate && 'hover:scale-[1.08] cursor-pointer'}`}
    >
      <div className="relative">
        <img
          className="w-full rounded-lg"
          src={`${import.meta.env.VITE_URL_STATIC}/video/covers/${data.cover}`}
          style={{ opacity: today >= availabilityDate ? '1' : '0.5' }}
          draggable={false}
        />
      </div>
      <div className="w-full flex flex-col items-start justify-center gap-2 text-center">
        <p
          className={`font-medium text-[18px] [@media(min-width:1400px)]:text-[20px] select-none text-wrap ${today < availabilityDate && 'text-gray-300'}`}
        >
          {data.title}
        </p>
        <p
          className={`font-medium text-[14px] w-full [@media(min-width:1400px)]:text-[18px] select-none text-wrap text-cyan-100 ${today < availabilityDate && 'text-cyan-100/60'}`}
        >
          {formatDate}
        </p>
      </div>
    </div>
  );
};
