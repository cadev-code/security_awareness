import {
  Pause,
  Play,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface PlayedTimeState {
  played: string;
  duration: string;
}

export const VideoPlayer = ({
  url_video,
  url_questions,
  close,
}: {
  url_video: string;
  url_questions: string;
  close: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [playedTime, setPlayedTime] = useState<PlayedTimeState>({
    played: '00:00',
    duration: '00:00',
  });

  useEffect(() => {
    if (videoRef.current?.duration && videoRef.current?.duration > 0) {
      const duration = videoRef.current.duration;
      const minutes: number = Math.trunc(duration / 60);
      const seconds: number = Math.trunc(duration % 60);

      setPlayedTime((current) => ({
        ...current,
        duration: `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`,
      }));
    }
  }, [videoRef.current?.duration]);

  const onPlayingChange = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const [timeLinePercent, setTimeLinePercent] = useState<number>(0);

  const onTimeUpdateAudio = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const audio = e.target as HTMLVideoElement;

    if (audio.duration === audio.currentTime) {
      setIsPlaying(false);
    }

    const percent = (audio.currentTime / audio.duration) * 100;
    setTimeLinePercent(percent);

    // cambiar estado del tiempo transcurrido
    const minutes: number = Math.trunc(audio.currentTime / 60);
    const seconds: number = Math.trunc(audio.currentTime % 60);

    setPlayedTime((current) => ({
      ...current,
      played: `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`,
    }));
  };

  const onTimeLineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);
    if (videoRef.current) {
      const video = videoRef.current;
      video.currentTime = (percent * video.duration) / 100;
      setTimeLinePercent(percent);
    }
  };

  const [volumePercent, setVolumePercent] = useState<number>(80);

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);
    setVolumePercent(percent);

    if (videoRef.current) {
      videoRef.current.volume = percent / 100;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volumePercent / 100;
    }
  }, [volumePercent]);

  const onMuteClick = () => {
    if (volumePercent > 1) {
      setVolumePercent(0);
    } else {
      setVolumePercent(80);
    }
  };

  const [hasOpenedQuestions, setHasOpenedQuestions] = useState<boolean>(false);
  const [showQuestionsAlert, setShowQuestionsAlert] = useState(false);

  useEffect(() => {
    if (
      !hasOpenedQuestions &&
      playedTime.played !== '00:00' &&
      playedTime.played === playedTime.duration
    ) {
      setHasOpenedQuestions(true);
      setShowQuestionsAlert(true);
      setTimeout(() => {
        window.open(url_questions, '_blank');
        setShowQuestionsAlert(false);
      }, 2000);
    }
  }, [playedTime, url_questions, hasOpenedQuestions]);

  useEffect(() => {
    if (playedTime.played === '00:00') {
      setHasOpenedQuestions(false);
    }
  }, [playedTime.played]);

  return (
    <div
      className="flex-col gap-3 pt-12 pb-8 px-8 rounded-xl relative border-2"
      style={{
        backgroundColor: '#0a1125',
        borderColor: '#4161b9',
      }}
    >
      <div className="w-full flex justify-end absolute top-3 right-3">
        <X className="cursor-pointer" onClick={close} size={28} />
      </div>
      <div
        className="w-[calc(50vw)] [@media(min-width:1400px)]:w-[calc(60vw)] rounded-xl border-2  bg-black"
        style={{ borderColor: '#4161b9' }}
      >
        <video
          className="w-full rounded-xl"
          ref={videoRef}
          onTimeUpdate={onTimeUpdateAudio}
          onClick={onPlayingChange}
        >
          <source src={url_video} type="video/mp4" />
        </video>
      </div>
      <div className="flex w-full gap-6 p-4 rounded-xl">
        {/* play/pause */}
        <button className="cursor-pointer" onClick={onPlayingChange}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        {/* timeline */}
        <div className="flex w-full items-center gap-2">
          <input
            className="w-full cursor-pointer"
            style={{ accentColor: '#4161b9' }}
            type="range"
            value={timeLinePercent}
            onChange={onTimeLineChange}
          />
          <p className="w-24 [@media(min-width:1400px)]:w-20 text-xs">
            {playedTime.played} - {playedTime.duration}
          </p>
        </div>
        {/* volume */}
        <div className="flex gap-2">
          <button className="cursor-pointer" onClick={onMuteClick}>
            {volumePercent > 70 ? (
              <Volume2 size={24} />
            ) : volumePercent > 20 ? (
              <Volume1 size={24} />
            ) : volumePercent > 1 ? (
              <Volume size={24} />
            ) : (
              <VolumeX size={24} />
            )}
          </button>
          <input
            type="range"
            className="w-full accent-green-300 cursor-pointer"
            style={{ accentColor: '#4161b9' }}
            value={volumePercent}
            onChange={onVolumeChange}
          />
        </div>
      </div>
      {/* cuestionario */}
      <div className="w-full flex justify-between items-center">
        <a
          className="bg-green-700 rounded py-1 px-2 font-medium text-xs [@media(min-width:1400px)]:text-lg [@media(min-width:1400px)]:rounded-md cursor-pointer"
          style={{ backgroundColor: '#375bbe' }}
          href={url_questions}
          target="_blank"
        >
          <span>Responder Cuestionario</span>
        </a>
        {showQuestionsAlert && (
          <div className="bg-white text-black py-1 px-2 rounded">
            Cargando cuestionario...
          </div>
        )}
      </div>
    </div>
  );
};
