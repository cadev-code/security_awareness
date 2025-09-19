import { Play } from 'lucide-react';
import { Video } from '../../Videos';

export const VideoCard = ({ data }: { data: Video }) => {
  return (
    <div
      className={`flex flex-col transition-transform hover:text-cyan-300 group ${data.availability === 1 && 'hover:scale-[1.08] cursor-pointer'}`}
    >
      <div className="w-full relative">
        <img
          className="w-full rounded-lg"
          src={`http://172.15.101.77:9080/video/covers/${data.cover}`}
          style={{ opacity: data.availability === 1 ? '1' : '0.4' }}
          draggable={false}
        />
        {data.availability === 1 && (
          <div className="w-full h-full absolute top-0 flex justify-center items-center">
            <div className="bg-black/50 p-4 rounded-full text-cyan-300 transition-opacity opacity-0 group-hover:opacity-100">
              <Play size={38} />
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col items-start justify-center p-2 gap-4">
        <p
          className={`font-medium text-[16px] [@media(min-width:1400px)]:text-xl select-none text-wrap ${data.availability === 0 && 'text-gray-400'}`}
        >
          {data.title}
        </p>
      </div>
    </div>
  );
};
