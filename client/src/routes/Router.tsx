import { Home, Podcast, Videos } from '@/pages';
import { Information } from '@/pages/Information/Information';
import { NewsLetters } from '@/pages/NewsLetter/NewsLetter';
import { Videos_Psswrd } from '@/pages/Videos_Psswrd/Videos_Psswrd';
import { Videos_Temporada3 } from '@/pages/Videos_Temporada3/Videos_Temporada3';
import { Videos_Temporada4 } from '@/pages/Videos_Temporada4/Videos_Temporada4';
import { Navigate, Route, Routes } from 'react-router';

export const Router = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="information" element={<Information />} />
      <Route path="temporada-1" element={<Podcast />} />
      <Route path="temporada-2" element={<Videos />} />
      <Route path="oct-si" element={<NewsLetters />} />
      <Route path="temporada-3" element={<Videos_Temporada3 />} />
      <Route path="psswrd" element={<Videos_Psswrd />} />
      <Route path="temporada-4" element={<Videos_Temporada4 />} />

      <Route path="/*" element={<Navigate to="/home" />} />
      <Route path="/podcast" element={<Navigate to="/temporada-1" />} />
    </Routes>
  );
};
