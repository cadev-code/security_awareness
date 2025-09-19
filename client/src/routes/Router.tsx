import { Home, Podcast, Videos } from '@/pages';
import { Navigate, Route, Routes } from 'react-router';

export const Router = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="temporada-1" element={<Podcast />} />
      <Route path="temporada-2" element={<Videos />} />

      <Route path="/*" element={<Navigate to="/home" />} />
      <Route path="/podcast" element={<Navigate to="/temporada-1" />} />
    </Routes>
  );
};
