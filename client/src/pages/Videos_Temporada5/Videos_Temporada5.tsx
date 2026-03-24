import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { VideoCard, VideoPlayer } from './components';
import { ImageVisualizer } from './components/ImageVisualizer/ImageVisualizer';
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react';

export interface File {
  id: number;
  title: string;
  filename: string;
  cover: string;
  availability: Date;
  url_questions: string;
}

export interface VideoToPlayState {
  reproduce: boolean;
  url_video: string;
  url_questions: string;
}

export const Videos_Temporada5 = () => {
  const [videosData, setVideosData] = useState<File[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(videosData.length / itemsPerPage);

  useEffect(() => {
    const getVideosData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL_API}/videos_temporada5`;
        const response = await axios.get(url);
        setVideosData(response.data.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    getVideosData();
  }, []);

  const videoToPlayDefaultValue: VideoToPlayState = {
    reproduce: false,
    url_video: '',
    url_questions: '',
  };

  const [videoToPlay, setVideoToPlay] = useState<VideoToPlayState>(
    videoToPlayDefaultValue,
  );

  const openVideoPlayer = (filename: string, url_questions: string) => {
    setVideoToPlay({
      reproduce: true,
      url_video: `${import.meta.env.VITE_URL_STATIC}/video/${filename}`,
      url_questions,
    });
  };

  const closeVideoPlayer = () => {
    setVideoToPlay(videoToPlayDefaultValue);
  };

  const [imageToShow, setImageToShow] = useState<{
    filename: string;
    url_questions: string;
  } | null>(null);

  const openImageVisualizer = (data: File) => {
    const today = new Date();
    const formattedAvailability = new Date(data.availability);

    if (today < formattedAvailability) {
      return;
    }

    setImageToShow({
      filename: data.filename,
      url_questions: data.url_questions,
    });
  };

  const closeImageVisualizer = () => {
    setImageToShow(null);
  };

  return (
    <div className="w-full h-[calc(100vh)] flex items-center justify-center relative gap-12">
      <img
        className="absolute select-none z-0 w-full h-full left-0 top-0"
        src={`/images/${page !== totalPages ? 'temporada5' : 'temporada5_parte2'}-fondo.jpg`}
        draggable={false}
      />
      {page > 1 && (
        <div
          className="z-2 bg-[#012559] hover:text-cyan-200 rounded-lg cursor-pointer transition-all hover:scale-110"
          onClick={() => {
            if (page > 1) {
              setSearchParams({ page: String(page - 1) });
            }
          }}
        >
          <SquareChevronLeft size={64} />
        </div>
      )}
      {videosData
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .map((data, i) => (
          <div
            key={i}
            className="z-2"
            onClick={() => {
              const today = new Date();
              const formattedAvailability = new Date(data.availability);
              if (today >= formattedAvailability) {
                if (data.title !== 'Exploradores de Riesgos (Bonus)') {
                  openVideoPlayer(data.filename, data.url_questions);
                } else {
                  openImageVisualizer(data);
                }
              }
            }}
          >
            <VideoCard key={i} data={data} />
          </div>
        ))}
      {page < totalPages && (
        <div
          className="z-2 bg-[#002a58] hover:text-cyan-200 rounded-lg cursor-pointer transition-all hover:scale-110"
          onClick={() => {
            if (page < totalPages) {
              setSearchParams({ page: String(page + 1) });
            }
          }}
        >
          <SquareChevronRight size={64} />
        </div>
      )}
      {videoToPlay.reproduce && (
        <div className="fixed top-0 left-0 w-full h-[calc(100vh)] bg-black/60 flex justify-center items-center z-2">
          <VideoPlayer
            url_video={videoToPlay.url_video}
            close={closeVideoPlayer}
            url_questions={videoToPlay.url_questions}
          />
        </div>
      )}
      {imageToShow && (
        <ImageVisualizer image={imageToShow} close={closeImageVisualizer} />
      )}
      <img
        className="w-48 [@media(min-width:1400px)]:w-60 absolute right-10 bottom-6 z-1"
        src="/images/logo.png"
        draggable={false}
      />
      <img
        className="w-86 [@media(min-width:1400px)]:w-120 absolute left-6 bottom-8 [@media(min-width:1400px)]:left-16 [@media(min-width:1400px)]:bottom-18 z-1"
        src={`/images/logo-${page !== totalPages ? 'temporada5' : 'temporada5_parte2'}.png`}
        draggable={false}
      />
    </div>
  );
};
