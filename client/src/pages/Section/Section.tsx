import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import axios from 'axios';

import type { Section as SectionType } from '@/types/section.types';
import type { Chapter } from '@/types/chapter.types';
import { ChapterCard } from './ChapterCard/ChapterCard';

export const Section = () => {
  const [section, setSection] = useState<SectionType | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [searchParams] = useSearchParams();
  const sectionId = Number(searchParams.get('id'));

  const getSection = async (sectionId: number) => {
    try {
      const url = `${import.meta.env.VITE_URL_API}/sections/${sectionId}`;
      const response = await axios.get(url);
      setSection(response.data);
    } catch (error) {
      setSection(null);
      console.error('Error al obtener sección:', error);
    }
  };

  useEffect(() => {
    getSection(sectionId);
  }, [sectionId]);

  const getChapters = async (sectionId: number) => {
    try {
      const url = `${import.meta.env.VITE_URL_API}/chapters/${sectionId}`;
      const response = await axios.get(url);
      setChapters(response.data);
    } catch (error) {
      setChapters([]);
      console.error('Error al obtener capítulos:', error);
    }
  };

  useEffect(() => {
    if (section) {
      getChapters(section.id);
    }
  }, [section]);

  return (
    <div className="w-full h-[calc(100vh)] flex items-center justify-center relative gap-12">
      {section?.bg_url && (
        <img
          className="absolute select-none z-0 w-full h-full left-0 top-0"
          src={`${import.meta.env.VITE_URL_STATIC}/backgrounds/${section?.bg_url}`}
          draggable={false}
        />
      )}
      {/* {page > 1 && (
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
      )} */}
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className="z-2"
          onClick={() => {
            const today = new Date();
            const formattedAvailability = new Date(chapter.availability);
            if (today >= formattedAvailability) {
              // if (
              //   data.title !== 'Exploradores de Riesgos (Bonus)' &&
              //   data.title !== 'Bonus 2: Newsletter'
              // ) {
              //   openVideoPlayer(data.filename, data.url_questions);
              // } else {
              //   openImageVisualizer(data);
              // }
            }
          }}
        >
          <ChapterCard chapter={chapter} />
        </div>
      ))}
      {/* {page < totalPages && (
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
      )} */}
      {/* {videoToPlay.reproduce && (
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
      )} */}
      <img
        className="w-48 [@media(min-width:1400px)]:w-60 absolute right-10 bottom-6 z-1"
        src="/images/logo.png"
        draggable={false}
      />
      {section?.flag_url && (
        <img
          className="w-86 [@media(min-width:1400px)]:w-120 absolute left-6 bottom-8 [@media(min-width:1400px)]:left-16 [@media(min-width:1400px)]:bottom-18 z-1"
          src={`${import.meta.env.VITE_URL_STATIC}/subtitles/${section?.flag_url}`}
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
};
