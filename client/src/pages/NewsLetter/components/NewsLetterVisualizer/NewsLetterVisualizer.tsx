import { X } from 'lucide-react';

export const NewsLetterVisualizer = ({
  filename,
  closeVisualizer,
}: {
  filename: string;
  closeVisualizer: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 py-12 w-full bg-black/90 h-full z-10 flex justify-center items-start overflow-y-auto">
      <div
        className="fixed top-12 right-28 p-2 rounded cursor-pointer bg-white text-black"
        onClick={closeVisualizer}
      >
        <X size={32} />
      </div>
      <img
        className="w-[60vw] h-auto"
        src={`${import.meta.env.VITE_URL_STATIC}/newsletter/${filename}`}
      />
    </div>
  );
};
