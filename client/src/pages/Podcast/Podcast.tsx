import axios from 'axios';
import { useEffect, useState } from 'react';
import { AudioPlayer } from './components';

export interface Podcast {
  id: number;
  title: string;
  filename: string;
  availability: number;
  url_questions: string;
}

export const Podcast = () => {
  const [podcastData, setPodcastData] = useState<Podcast[]>([]);

  useEffect(() => {
    const getPodcastsData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL_API}/posts`;
        const response = await axios.get(url);
        setPodcastData(response.data.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    getPodcastsData();
  }, []);

  const [episodeToPlay, setEpisodeToPlay] = useState({ id: 0 });

  return (
    <div className="relative">
      <img
        className="w-full absolute right-0 bottom-0 z-0"
        src="/images/podcast-footer.png"
      />
      <img
        className="w-60 absolute right-10 bottom-6 z-1"
        src="/images/logo.png"
      />
      <div className="w-full h-[calc(100vh)] flex flex-col items-center pt-16 pb-16 pr-16 pl-16 overflow-y-scroll relative z-0">
        <div className="flex flex-col gap-6">
          {podcastData.map((data, i) => (
            <AudioPlayer
              key={i}
              data={data}
              episodeToPlay={episodeToPlay}
              setEpisodeToPlay={setEpisodeToPlay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
