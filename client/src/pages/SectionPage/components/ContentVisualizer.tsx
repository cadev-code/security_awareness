import { X } from 'lucide-react';

export const ContentVisualizer = ({
  filename,
  type,
  close,
}: {
  filename: string;
  type: 'pdf' | 'image';
  close: () => void;
}) => {
  const url = `${import.meta.env.VITE_URL_STATIC}/${type === 'pdf' ? 'newsletter' : 'video'}/${filename}`;

  return (
    <div className="fixed top-0 left-0 py-12 w-full bg-black/90 h-full z-10 flex justify-center items-start overflow-y-auto">
      <button
        className="fixed top-12 right-28 p-2 rounded cursor-pointer bg-white text-black"
        onClick={close}
      >
        <X size={32} />
      </button>
      <img className="w-[60vw] h-auto" draggable={false} src={url} />
    </div>
  );
};
