import { Navigate, Route, Routes } from 'react-router';

import { Home, Podcast } from '@/pages';
import { Information } from '@/pages/Information/Information';
import { Section } from '@/pages/Section/Section';

import { Login } from '@/admin/pages/Login/Login';
import { SectionsManagement } from '@/admin/pages/SectionsManagement/SectionsManagement';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

export const Router = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="information" element={<Information />} />
      <Route path="temporada-1" element={<Podcast />} />
      <Route path="section" element={<Section />} />

      <Route
        path="admin/auth/login"
        element={<PublicRoute element={<Login />} />}
      />

      <Route
        path="admin/sections-management"
        element={<ProtectedRoute element={<SectionsManagement />} />}
      />

      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
