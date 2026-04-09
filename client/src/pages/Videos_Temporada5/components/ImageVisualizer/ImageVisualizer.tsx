import { X } from 'lucide-react';

export const ImageVisualizer = ({
  image,
  close,
}: {
  image: {
    filename: string;
    url_questions: string;
  };
  close: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 py-12 w-full bg-black/90 h-full z-10 flex justify-center items-start overflow-y-auto">
      {image.filename !== 'episodio7-temporada5.jpg' && (
        <a
          className="bg-green-700 rounded py-1 px-2 font-medium text-sm [@media(min-width:1400px)]:text-lg [@media(min-width:1400px)]:rounded-md cursor-pointer fixed top-12 left-28"
          style={{ backgroundColor: '#327ac2' }}
          href={image.url_questions}
          target="_blank"
        >
          <span>Responder Cuestionario</span>
        </a>
      )}
      <div
        className="fixed top-12 right-28 p-2 rounded cursor-pointer bg-white text-black"
        onClick={close}
      >
        <X size={32} />
      </div>
      <img
        className="w-[60vw] h-auto"
        draggable={false}
        src={`${import.meta.env.VITE_URL_STATIC}/video/${image.filename}`}
      />
    </div>
  );
};
