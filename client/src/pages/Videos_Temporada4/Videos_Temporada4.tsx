import axios from 'axios';
import { useEffect, useState } from 'react';
import { VideoCard, VideoPlayer } from './components';

export interface Video {
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

export const Videos_Temporada4 = () => {
  const [videosData, setVideosData] = useState<Video[]>([]);

  useEffect(() => {
    const getVideosData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL_API}/videos_temporada4`;
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

  return (
    <div className="w-full h-[calc(100vh)] flex items-center justify-center relative gap-12">
      <img
        className="absolute select-none z-0 w-full h-full left-0 top-0"
        src="/images/temporada4-fondo.jpg"
        draggable={false}
      />
      {videosData.map((data, i) => (
        <div
          key={i}
          className="z-2"
          onClick={() => {
            const today = new Date();
            const formattedAvailability = new Date(data.availability);
            if (today >= formattedAvailability) {
              openVideoPlayer(data.filename, data.url_questions);
            }
          }}
        >
          <VideoCard key={i} data={data} />
        </div>
      ))}
      {videoToPlay.reproduce && (
        <div className="fixed top-0 left-0 w-full h-[calc(100vh)] bg-black/60 flex justify-center items-center z-2">
          <VideoPlayer
            url_video={videoToPlay.url_video}
            close={closeVideoPlayer}
            url_questions={videoToPlay.url_questions}
          />
        </div>
      )}
      <img
        className="w-48 [@media(min-width:1400px)]:w-60 absolute right-10 bottom-6 z-1"
        src="/images/logo.png"
        draggable={false}
      />
      <img
        className="w-86 [@media(min-width:1400px)]:w-120 absolute left-6 bottom-8 [@media(min-width:1400px)]:left-16 [@media(min-width:1400px)]:bottom-18 z-1"
        src="/images/logo-temporada4.png"
        draggable={false}
      />
    </div>
  );
};
