import { Navigate, Route, Routes } from 'react-router';

import { Home, Podcast } from '@/pages';
import { Information } from '@/pages/Information/Information';
import { Section } from '@/pages/Section/Section';
import { Login } from '@/admin/pages/Login/Login';

export const Router = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="information" element={<Information />} />
      <Route path="temporada-1" element={<Podcast />} />
      <Route path="section" element={<Section />} />
      <Route path="admin/auth/login" element={<Login />} />

      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
