import axios from 'axios';
import { useEffect, useState } from 'react';
import { VideoCard, VideoPlayer } from './components';

export interface Video {
  id: number;
  title: string;
  filename: string;
  cover: string;
  availability: number;
  url_questions: string;
}

export interface VideoToPlayState {
  reproduce: boolean;
  url_video: string;
  url_questions: string;
}

export const Videos = () => {
  const [videosData, setVideosData] = useState<Video[]>([]);

  useEffect(() => {
    const getVideosData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL_API}/videos`;
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
      url_video: `http://172.15.101.77:9080/video/${filename}`,
      url_questions,
    });
  };

  const closeVideoPlayer = () => {
    setVideoToPlay(videoToPlayDefaultValue);
  };

  return (
    <div className="w-full h-[calc(100vh)] grid grid-cols-2 xl:grid-cols-3 grid-rows-3 py-18 px-48 gap-x-24 gap-y-52 relative">
      <img
        className="absolute select-none z-0 w-full h-full"
        src="/images/temporada2-fondo.jpg"
        draggable={false}
      />
      {videosData.map((data, i) => (
        <div
          className="w-full z-2"
          onClick={() =>
            data.availability &&
            openVideoPlayer(data.filename, data.url_questions)
          }
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
        className="w-48 [@media(min-width:1400px)]:w-80 absolute left-6 bottom-8 [@media(min-width:1400px)]:left-16 [@media(min-width:1400px)]:bottom-18 z-1"
        src="/images/logo-temporada2.png"
        draggable={false}
      />
    </div>
  );
};
