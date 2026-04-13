import { Navigate, Route, Routes } from 'react-router';

import { Home, Podcast } from '@/pages';
import { Information } from '@/pages/Information/Information';
import { Section } from '@/pages/Section/Section';

export const Router = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="information" element={<Information />} />
      <Route path="temporada-1" element={<Podcast />} />
      <Route path="section" element={<Section />} />

      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
