import { File } from '../../Videos_Temporada5';

export const VideoCard = ({ data }: { data: File }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset hours to compare only dates

  const availabilityDate = new Date(data.availability);
  availabilityDate.setHours(0, 0, 0, 0); // Reset hours to compare only dates

  return (
    <div
      className={`w-46 [@media(min-width:1230px)]:w-54  [@media(min-width:1360px)]:w-62 [@media(min-width:1490px)]:w-68 [@media(min-width:1660px)]:w-80 flex flex-col items-center transition-transform group ${today >= availabilityDate && 'hover:scale-[1.08] cursor-pointer'}`}
    >
      <div className="relative">
        <img
          className="w-full rounded-lg"
          src={`${import.meta.env.VITE_URL_STATIC}/video/covers/${data.cover}`}
          style={{ opacity: today >= availabilityDate ? '1' : '0.7' }}
          draggable={false}
        />
      </div>
    </div>
  );
};
