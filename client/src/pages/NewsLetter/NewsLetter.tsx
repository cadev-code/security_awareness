import axios from 'axios';
import { useEffect, useState } from 'react';
import { NewsLetterCard } from './components/NewsLetterCard/NewsLetterCard';
import { NewsLetterVisualizer } from './components/NewsLetterVisualizer/NewsLetterVisualizer';

export interface NewsLetter {
  id: number;
  filename: string;
  cover: string;
  availability: Date;
}

export const NewsLetters = () => {
  const [newsLetter, setNewsLetter] = useState<NewsLetter[]>([]);

  const [showVisualizer, setShowVisualizer] = useState<boolean>(false);
  const [fileToDisplay, setFileToDisplay] = useState<string>('');

  useEffect(() => {
    const getNewsLetterData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL_API}/newsletters`;
        const response = await axios.get(url);
        setNewsLetter(response.data.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    getNewsLetterData();
  }, []);

  const openVisualizer = (filename: string, availability: Date) => {
    const today = new Date();
    const formattedAvailability = new Date(availability);

    if (today < formattedAvailability) {
      return;
    }

    setShowVisualizer(true);
    setFileToDisplay(filename);
  };

  const closeVisualizer = () => {
    setShowVisualizer(false);
  };

  return (
    <div className="w-full h-[calc(100vh)] grid grid-cols-2 xl:grid-cols-3 grid-rows-3 py-18 px-48 gap-x-24 gap-y-52 relative select-none">
      {newsLetter.map((data, i) => (
        <div
          key={i}
          className="w-full z-2"
          onClick={() => openVisualizer(data.filename, data.availability)}
        >
          <NewsLetterCard
            data={{ ...data, availability: new Date(data.availability) }}
          />
        </div>
      ))}
      <img
        className="absolute select-none z-0 w-full h-full"
        src="/images/newsletter-fondo.jpg"
        draggable={false}
      />
      <img
        className="w-48 [@media(min-width:1400px)]:w-60 absolute right-10 bottom-6 z-1"
        src="/images/logo.png"
        draggable={false}
      />
      <img
        className="w-120 [@media(min-width:1400px)]:w-140 absolute left-6 bottom-8 [@media(min-width:1400px)]:left-16 [@media(min-width:1400px)]:bottom-18 z-1"
        src="/images/logo-newsletter.png"
        draggable={false}
      />
      {showVisualizer && (
        <NewsLetterVisualizer
          filename={fileToDisplay}
          closeVisualizer={closeVisualizer}
        />
      )}
    </div>
  );
};
