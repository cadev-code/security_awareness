import { Play } from 'lucide-react';
import { Video } from '../../Videos_Psswrd';

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
      className={`flex flex-col transition-transform text-gray-200  group ${today >= availabilityDate && 'hover:scale-[1.08] cursor-pointer'}`}
    >
      <div className="w-full relative">
        <img
          className="w-full rounded-lg"
          src={`${import.meta.env.VITE_URL_STATIC}/video/covers/${data.cover}`}
          style={{ opacity: today >= availabilityDate ? '1' : '0.4' }}
          draggable={false}
        />
        {today >= availabilityDate && (
          <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pointer-events-none">
            <div className="bg-black/50 p-4 rounded-full text-white transition-opacity opacity-0 group-hover:opacity-100 pointer-events-auto">
              <Play size={38} />
            </div>
          </div>
        )}
      </div>
      <div
        className={`w-fit mx-auto flex flex-col items-center justify-center px-4 py-2 bg-[#0099e8] rounded-md ${today < availabilityDate && 'bg-[#0099e8]/60'}`}
      >
        <p
          className={`font-medium text-[20px] [@media(min-width:1400px)]:text-[24px] select-none text-wrap ${today < availabilityDate && 'text-[#5fb8ce]'}`}
        >
          {data.title}
        </p>
        <p
          className={`font-medium text-[14px] [@media(min-width:1400px)]:text-[18px] select-none text-wrap ${today < availabilityDate && 'text-[#5fb8ce]'}`}
        >
          {formatDate}
        </p>
      </div>
    </div>
  );
};
