import { Navigate, Route, Routes } from 'react-router';

import { Home, Podcast, Videos } from '@/pages';
import { Information } from '@/pages/Information/Information';
import { NewsLetters } from '@/pages/NewsLetter/NewsLetter';
import { Videos_Psswrd } from '@/pages/Videos_Psswrd/Videos_Psswrd';
import { Videos_Temporada3 } from '@/pages/Videos_Temporada3/Videos_Temporada3';
import { Videos_Temporada4 } from '@/pages/Videos_Temporada4/Videos_Temporada4';
import { Videos_Temporada5 } from '@/pages/Videos_Temporada5/Videos_Temporada5';
import { Section } from '@/pages/Section/Section';

export const Router = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="information" element={<Information />} />
      <Route path="section" element={<Section />} />
      <Route path="temporada-1" element={<Podcast />} />
      <Route path="temporada-2" element={<Videos />} />
      <Route path="oct-si" element={<NewsLetters />} />
      <Route path="temporada-3" element={<Videos_Temporada3 />} />
      <Route path="psswrd" element={<Videos_Psswrd />} />
      <Route path="temporada-4" element={<Videos_Temporada4 />} />
      <Route path="temporada-5" element={<Videos_Temporada5 />} />

      <Route path="/*" element={<Navigate to="/home" />} />
      <Route path="/podcast" element={<Navigate to="/temporada-1" />} />
    </Routes>
  );
};
