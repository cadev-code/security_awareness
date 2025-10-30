import { NewsLetter } from '../../NewsLetter';

export const NewsLetterCard = ({ data }: { data: NewsLetter }) => {
  const today = new Date();
  const formatDate = new Date(data.availability).toLocaleDateString('es-Es', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

  return (
    <div
      className={`flex flex-col transform transition-transform ${today >= data.availability && 'cursor-pointer hover:scale-[1.08]'}`}
    >
      <div className="w-full relative">
        <img
          className={`w-full rounded-lg ${today < data.availability ? 'opacity-50' : ''}`}
          src={`${import.meta.env.VITE_URL_STATIC}/newsletter/covers/${data.cover}`}
          draggable={false}
        />
      </div>
      <div className="w-full flex flex-col items-start justify-center p-2 gap-4">
        <p
          className={`w-full text-center font-medium text-[16px] [@media(min-width:1400px)]:text-xl select-none text-wrap ${today < data.availability && 'text-gray-400'}`}
        >
          Disponible{' '}
          {today < data.availability ? `el ${formatDate}` : `(${formatDate})`}
        </p>
      </div>
    </div>
  );
};
