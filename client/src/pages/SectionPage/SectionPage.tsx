import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react';
import { Section, ContentItem } from '@/types/cms';
import { ContentCard } from './components/ContentCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ContentVisualizer } from './components/ContentVisualizer';
import { AudioPlayerItem } from './components/AudioPlayerItem';

interface VideoToPlay {
  reproduce: boolean;
  url_video: string;
  url_questions: string;
}

const defaultVideoToPlay: VideoToPlay = {
  reproduce: false,
  url_video: '',
  url_questions: '',
};

export const SectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [section, setSection] = useState<Section | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);

  const [videoToPlay, setVideoToPlay] = useState<VideoToPlay>(defaultVideoToPlay);
  const [visualizerFile, setVisualizerFile] = useState<{
    filename: string;
    type: 'pdf' | 'image';
    url_questions: string;
  } | null>(null);
  const [episodeToPlay, setEpisodeToPlay] = useState<{ id: number }>({ id: 0 });

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const [sectionsRes, contentRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL_API}/sections`),
          axios.get(`${import.meta.env.VITE_URL_API}/sections/${slug}/content`),
        ]);
        const found: Section | undefined = (sectionsRes.data.data as Section[]).find(
          (s) => s.slug === slug,
        );
        setSection(found ?? null);
        setItems(contentRes.data.data ?? []);
      } catch (err) {
        console.error('Error loading section:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-white/50">Cargando...</p>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-white/50">Sección no encontrada.</p>
      </div>
    );
  }

  const isAvailable = (availability: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const raw = new Date(availability);
    const avDate = new Date(raw.getUTCFullYear(), raw.getUTCMonth(), raw.getUTCDate());
    return today >= avDate;
  };

  const handleItemClick = (item: ContentItem) => {
    if (!isAvailable(item.availability)) return;
    if (item.content_type === 'audio') return; // handled by AudioPlayerItem itself
    if (item.content_type === 'image' || item.content_type === 'pdf') {
      setVisualizerFile({
        filename: item.filename,
        type: item.content_type,
        url_questions: item.url_questions,
      });
      return;
    }
    setVideoToPlay({
      reproduce: true,
      url_video: `${import.meta.env.VITE_URL_STATIC}/video/${item.filename}`,
      url_questions: item.url_questions,
    });
  };

  const itemsPerPage = section.items_per_page;
  const totalPages = itemsPerPage ? Math.ceil(items.length / itemsPerPage) : 1;
  const visibleItems = itemsPerPage
    ? items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : items;

  const bgImage = section.bg_image
    ? `/images/${section.bg_image}`
    : undefined;

  // ── Podcast layout ──────────────────────────────────────────
  if (section.type === 'podcast') {
    return (
      <div className="relative">
        {section.section_logo && (
          <img
            className="w-full absolute right-0 bottom-0 z-0"
            src={`/images/${section.section_logo}`}
          />
        )}
        <img className="w-60 absolute right-10 bottom-6 z-1" src="/images/logo.png" />
        <div className="w-full h-[calc(100vh)] flex flex-col items-center pt-16 pb-16 pr-16 pl-16 overflow-y-scroll relative z-0">
          <div className="flex flex-col gap-6 w-full max-w-3xl">
            {items.map((item) => (
              <AudioPlayerItem
                key={item.id}
                item={item}
                episodeToPlay={episodeToPlay}
                setEpisodeToPlay={setEpisodeToPlay}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Grid layout (video grid or newsletter) ──────────────────
  if (section.layout === 'grid') {
    return (
      <div className="w-full h-[calc(100vh)] grid grid-cols-2 xl:grid-cols-3 grid-rows-3 py-18 px-48 gap-x-24 gap-y-52 relative select-none">
        {bgImage && (
          <img className="absolute select-none z-0 w-full h-full" src={bgImage} draggable={false} />
        )}
        {visibleItems.map((item) => (
          <div key={item.id} className="w-full z-2">
            <ContentCard
              item={item}
              section={section}
              onClick={() => handleItemClick(item)}
            />
          </div>
        ))}
        {videoToPlay.reproduce && (
          <div className="fixed top-0 left-0 w-full h-[calc(100vh)] bg-black/60 flex justify-center items-center z-10">
            <VideoPlayerModal
              url_video={videoToPlay.url_video}
              url_questions={videoToPlay.url_questions}
              close={() => setVideoToPlay(defaultVideoToPlay)}
            />
          </div>
        )}
        {visualizerFile && (
          <ContentVisualizer
            filename={visualizerFile.filename}
            type={visualizerFile.type}
            close={() => setVisualizerFile(null)}
          />
        )}
        <img
          className="w-48 xl:w-60 absolute right-10 bottom-6 z-1"
          src="/images/logo.png"
          draggable={false}
        />
        {section.section_logo && (
          <img
            className="w-48 xl:w-80 absolute left-6 bottom-8 xl:left-16 xl:bottom-18 z-1"
            src={`/images/${section.section_logo}`}
            draggable={false}
          />
        )}
      </div>
    );
  }

  // ── Flex layout (horizontal row, optional pagination) ───────
  return (
    <div className="w-full h-[calc(100vh)] flex items-center justify-center relative gap-12">
      {bgImage && (
        <img
          className="absolute select-none z-0 w-full h-full left-0 top-0"
          src={bgImage}
          draggable={false}
        />
      )}
      {page > 1 && (
        <div
          className="z-2 rounded-lg cursor-pointer transition-all hover:scale-110 hover:text-cyan-200"
          style={{ backgroundColor: section.color_theme }}
          onClick={() => setSearchParams({ page: String(page - 1) })}
        >
          <SquareChevronLeft size={64} />
        </div>
      )}
      {visibleItems.map((item) => (
        <div key={item.id} className="z-2">
          <ContentCard
            item={item}
            section={section}
            onClick={() => handleItemClick(item)}
          />
        </div>
      ))}
      {page < totalPages && (
        <div
          className="z-2 rounded-lg cursor-pointer transition-all hover:scale-110 hover:text-cyan-200"
          style={{ backgroundColor: section.color_theme }}
          onClick={() => setSearchParams({ page: String(page + 1) })}
        >
          <SquareChevronRight size={64} />
        </div>
      )}
      {videoToPlay.reproduce && (
        <div className="fixed top-0 left-0 w-full h-[calc(100vh)] bg-black/60 flex justify-center items-center z-10">
          <VideoPlayerModal
            url_video={videoToPlay.url_video}
            url_questions={videoToPlay.url_questions}
            close={() => setVideoToPlay(defaultVideoToPlay)}
          />
        </div>
      )}
      {visualizerFile && (
        <ContentVisualizer
          filename={visualizerFile.filename}
          type={visualizerFile.type}
          close={() => setVisualizerFile(null)}
        />
      )}
      <img
        className="w-48 xl:w-60 absolute right-10 bottom-6 z-1"
        src="/images/logo.png"
        draggable={false}
      />
      {section.section_logo && (
        <img
          className="w-86 xl:w-120 absolute left-6 bottom-8 xl:left-16 xl:bottom-18 z-1"
          src={`/images/${section.section_logo}`}
          draggable={false}
        />
      )}
    </div>
  );
};
