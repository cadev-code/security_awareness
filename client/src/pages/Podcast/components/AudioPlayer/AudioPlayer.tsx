import { Pause, Play, Volume, Volume1, Volume2 } from 'lucide-react';
import { Podcast } from '../../Podcast';
import React, { useEffect, useRef, useState } from 'react';

export const AudioPlayer = ({
  data,
  episodeToPlay,
  setEpisodeToPlay,
}: {
  data: Podcast;
  episodeToPlay: { id: number };
  setEpisodeToPlay: React.Dispatch<React.SetStateAction<{ id: number }>>;
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const onClickPlay = (id: number) => {
    if (episodeToPlay.id !== id) {
      setEpisodeToPlay({ id });
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const [volumePercent, setVolumePercent] = useState(80);

  const onChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolumePercent(Number(e.target.value));
  };

  const onClickVolume = () => {
    if (volumePercent > 0) setVolumePercent(0);
    else setVolumePercent(80);
  };

  const [timeLinePercent, setTimeLinePercent] = useState(0);

  const onChangeTimeLine = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);
    setTimeLinePercent(percent);

    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (duration * percent) / 100;
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTimeLinePercent(0);
    setVolumePercent(80);
    if (episodeToPlay.id === data.id && audioRef.current) {
      const url = `${import.meta.env.VITE_URL_API}/audio/${data.filename}`;
      audioRef.current.src = url;
      audioRef.current.volume = volumePercent / 100;
      audioRef.current.play();

      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };

      if (audioRef.current) {
        audioRef.current.addEventListener(
          'loadedmetadata',
          handleLoadedMetadata,
        );
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            'loadedmetadata',
            handleLoadedMetadata,
          );
        }
      };
    }

    setDuration(0);
    setPlayedTime({
      played: '00:00',
      duration: '00:00',
    });
  }, [episodeToPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumePercent / 100;
    }
  }, [volumePercent]);

  const onTimeUpdateAudio = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    const percent = (audio.currentTime / audio.duration) * 100;
    setTimeLinePercent(percent);

    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);

    setPlayedTime({
      duration: playedTime.duration,
      played: `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`,
    });
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const [duration, setDuration] = useState(0);
  const [playedTime, setPlayedTime] = useState({
    played: '00:00',
    duration: '00:00',
  });

  useEffect(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    setPlayedTime({
      played: playedTime.played,
      duration: `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`,
    });
  }, [duration]);

  return (
    <div
      className="w-full p-4 border-2 rounded-lg flex justify-between"
      style={{ borderColor: '#1296224d', backgroundColor: '#050a07' }}
    >
      <div className="w-full flex flex-col gap-4 items-start">
        <p className="font-medium text-xl">{data.title}</p>
        <div className="w-full flex items-center gap-4">
          {episodeToPlay.id === data.id ? (
            <div
              className="inline-block p-3 cursor-pointer hover:text-green-600"
              onClick={() => onClickPlay(data.id)}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </div>
          ) : (
            <div
              className="bg-white/10 rounded-full inline-block p-3 cursor-pointer hover:text-green-600"
              onClick={() => onClickPlay(data.id)}
            >
              <Play size={32} />
            </div>
          )}
          {episodeToPlay.id === data.id && (
            <div className="flex w-full gap-4">
              <audio ref={audioRef} hidden onTimeUpdate={onTimeUpdateAudio} />
              <input
                className="w-full accent-green-300 cursor-pointer"
                type="range"
                value={timeLinePercent}
                onChange={onChangeTimeLine}
              />
              <p className="w-26 text-xs">
                {playedTime.played} - {playedTime.duration}
              </p>
              <div className="flex flex-row items-center gap-1">
                <div onClick={onClickVolume} className="cursor-pointer">
                  {volumePercent > 70 ? (
                    <Volume2 size={24} />
                  ) : volumePercent > 20 ? (
                    <Volume1 size={24} />
                  ) : (
                    <Volume size={24} />
                  )}
                </div>
                <input
                  className="w-full accent-green-300 cursor-pointer"
                  type="range"
                  value={volumePercent}
                  onChange={onChangeVolume}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
