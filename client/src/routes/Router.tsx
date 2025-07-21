import { Home, Podcast } from '@/pages';
import { Navigate, Route, Routes } from 'react-router';

export const Router = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="podcast" element={<Podcast />} />

      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
