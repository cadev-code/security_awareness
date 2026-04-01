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

export const VideoPlayerModal = ({
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
    if (videoRef.current?.duration && videoRef.current.duration > 0) {
      const duration = videoRef.current.duration;
      const minutes = Math.trunc(duration / 60);
      const seconds = Math.trunc(duration % 60);
      setPlayedTime((c) => ({
        ...c,
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

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (video.duration === video.currentTime) setIsPlaying(false);
    const percent = (video.currentTime / video.duration) * 100;
    setTimeLinePercent(isNaN(percent) ? 0 : percent);

    const minutes = Math.floor(video.currentTime / 60);
    const seconds = Math.floor(video.currentTime % 60);
    setPlayedTime((c) => ({
      ...c,
      played: `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`,
    }));
  };

  const [volumePercent, setVolumePercent] = useState<number>(80);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volumePercent / 100;
  }, [volumePercent]);

  const onChangeTimeLine = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);
    setTimeLinePercent(percent);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration * percent) / 100;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden w-[80vw] max-w-5xl shadow-2xl">
      <video
        ref={videoRef}
        className="w-full"
        src={url_video}
        onTimeUpdate={onTimeUpdate}
      />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-black/50 via-transparent to-black/70 opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex justify-between">
          <a
            className="bg-blue-600 hover:bg-blue-500 rounded py-1 px-3 text-sm font-medium cursor-pointer"
            href={url_questions}
            target="_blank"
          >
            Responder Cuestionario
          </a>
          <button
            className="bg-white/20 hover:bg-white/40 rounded p-1 cursor-pointer"
            onClick={close}
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <input
            className="w-full accent-cyan-300 cursor-pointer"
            type="range"
            value={timeLinePercent}
            onChange={onChangeTimeLine}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="hover:text-cyan-300 cursor-pointer"
                onClick={onPlayingChange}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <span className="text-sm">
                {playedTime.played} / {playedTime.duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer"
                onClick={() =>
                  setVolumePercent((v) => (v > 0 ? 0 : 80))
                }
              >
                {volumePercent === 0 ? (
                  <VolumeX size={20} />
                ) : volumePercent > 60 ? (
                  <Volume2 size={20} />
                ) : volumePercent > 20 ? (
                  <Volume1 size={20} />
                ) : (
                  <Volume size={20} />
                )}
              </button>
              <input
                className="w-24 accent-cyan-300 cursor-pointer"
                type="range"
                value={volumePercent}
                onChange={(e) => setVolumePercent(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
