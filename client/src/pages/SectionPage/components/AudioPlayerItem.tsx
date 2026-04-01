import { Pause, Play, Volume, Volume1, Volume2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ContentItem } from '@/types/cms';

const isAvailable = (availability: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const raw = new Date(availability);
  const avDate = new Date(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate());
  return today >= avDate;
};

export const AudioPlayerItem = ({
  item,
  episodeToPlay,
  setEpisodeToPlay,
}: {
  item: ContentItem;
  episodeToPlay: { id: number };
  setEpisodeToPlay: React.Dispatch<React.SetStateAction<{ id: number }>>;
}) => {
  const available = isAvailable(item.availability);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumePercent, setVolumePercent] = useState(80);
  const [timeLinePercent, setTimeLinePercent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playedTime, setPlayedTime] = useState({ played: '00:00', duration: '00:00' });
  const [showAlert, setShowAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onClickPlay = () => {
    if (!available) return;
    if (episodeToPlay.id !== item.id) {
      setEpisodeToPlay({ id: item.id });
    } else {
      setIsPlaying((p) => !p);
    }
  };

  useEffect(() => {
    setTimeLinePercent(0);
    setVolumePercent(80);
    if (episodeToPlay.id === item.id && audioRef.current) {
      const url = `${import.meta.env.VITE_URL_API}/audio/${item.filename}`;
      audioRef.current.src = url;
      audioRef.current.volume = 0.8;
      audioRef.current.play();
      const handleMeta = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
      };
      audioRef.current.addEventListener('loadedmetadata', handleMeta);
      return () => audioRef.current?.removeEventListener('loadedmetadata', handleMeta);
    }
    setDuration(0);
    setPlayedTime({ played: '00:00', duration: '00:00' });
  }, [episodeToPlay]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volumePercent / 100;
  }, [volumePercent]);

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    const m = Math.floor(duration / 60);
    const s = Math.floor(duration % 60);
    setPlayedTime((p) => ({
      ...p,
      duration: `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`,
    }));
  }, [duration]);

  useEffect(() => {
    if (playedTime.played === playedTime.duration && playedTime.duration !== '00:00') {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        window.open(item.url_questions, '_blank');
      }, 2000);
    }
  }, [playedTime.played]);

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    const percent = (audio.currentTime / audio.duration) * 100;
    setTimeLinePercent(isNaN(percent) ? 0 : percent);
    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60);
    setPlayedTime((p) => ({
      ...p,
      played: `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`,
    }));
  };

  const onChangeTimeLine = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);
    setTimeLinePercent(percent);
    if (audioRef.current) {
      audioRef.current.currentTime = (audioRef.current.duration * percent) / 100;
      audioRef.current.play();
    }
  };

  return (
    <div
      className="w-full p-4 border-2 rounded-lg flex justify-between flex-col relative"
      style={{
        borderColor: available ? '#1296224d' : '#073b0d4d',
        backgroundColor: '#050a07',
      }}
    >
      {available ? (
        <div className="w-full flex flex-col gap-4 items-start">
          <p className="font-medium text-xl select-none">{item.title}</p>
          <div className="w-full flex items-center gap-4">
            {episodeToPlay.id === item.id ? (
              <button className="inline-block p-3 cursor-pointer hover:text-green-600" onClick={onClickPlay}>
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
            ) : (
              <button className="bg-white/10 rounded-full inline-block p-3 cursor-pointer hover:text-green-600" onClick={onClickPlay}>
                <Play size={32} />
              </button>
            )}
            {episodeToPlay.id === item.id && (
              <div className="flex w-full gap-4">
                <audio ref={audioRef} hidden onTimeUpdate={onTimeUpdate} />
                <input
                  className="w-full accent-green-300 cursor-pointer"
                  type="range"
                  value={timeLinePercent}
                  onChange={onChangeTimeLine}
                />
                <p className="w-26 text-xs">{playedTime.played} - {playedTime.duration}</p>
                <div className="flex flex-row items-center gap-1">
                  <button onClick={() => setVolumePercent((v) => v > 0 ? 0 : 80)} className="cursor-pointer">
                    {volumePercent > 70 ? <Volume2 size={24} /> : volumePercent > 20 ? <Volume1 size={24} /> : <Volume size={24} />}
                  </button>
                  <input
                    className="w-full accent-green-300 cursor-pointer"
                    type="range"
                    value={volumePercent}
                    onChange={(e) => setVolumePercent(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="cursor-default select-none w-full flex flex-col gap-4 items-start">
          <p className="font-medium text-xl text-gray-500">{item.title}</p>
          <div className="bg-white/10 rounded-full inline-block p-3 text-gray-500">
            <Play size={32} />
          </div>
        </div>
      )}
      {episodeToPlay.id === item.id && (
        <div className="w-full mt-3">
          <a
            className="bg-green-700 rounded-md py-1 px-2 font-medium"
            href={item.url_questions}
            target="_blank"
          >
            <span>Responder Cuestionario</span>
          </a>
        </div>
      )}
      {episodeToPlay.id === item.id && showAlert && (
        <div className="absolute bottom-2 right-2 bg-white rounded-md text-black px-3 py-1 select-none">
          <p>Cargando cuestionario...</p>
        </div>
      )}
    </div>
  );
};
