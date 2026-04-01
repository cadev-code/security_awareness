import { Navigate, Route, Routes } from 'react-router';

import { Home, Podcast, Videos } from '@/pages';
import { Information } from '@/pages/Information/Information';
import { NewsLetters } from '@/pages/NewsLetter/NewsLetter';
import { Videos_Psswrd } from '@/pages/Videos_Psswrd/Videos_Psswrd';
import { Videos_Temporada3 } from '@/pages/Videos_Temporada3/Videos_Temporada3';
import { Videos_Temporada4 } from '@/pages/Videos_Temporada4/Videos_Temporada4';
import { Videos_Temporada5 } from '@/pages/Videos_Temporada5/Videos_Temporada5';
import { SectionPage } from '@/pages/SectionPage/SectionPage';
import { AdminLogin } from '@/pages/Admin/AdminLogin';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/pages/Admin/AdminLayout';
import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { AdminSections } from '@/pages/Admin/AdminSections';
import { AdminSectionForm } from '@/pages/Admin/AdminSectionForm';
import { AdminContent } from '@/pages/Admin/AdminContent';
import { AdminContentForm } from '@/pages/Admin/AdminContentForm';

export const Router = () => {
  return (
    <Routes>
      {/* Legacy hard-coded pages (kept for backward compatibility) */}
      <Route path="home" element={<Home />} />
      <Route path="information" element={<Information />} />
      <Route path="temporada-1" element={<Podcast />} />
      <Route path="temporada-2" element={<Videos />} />
      <Route path="oct-si" element={<NewsLetters />} />
      <Route path="temporada-3" element={<Videos_Temporada3 />} />
      <Route path="psswrd" element={<Videos_Psswrd />} />
      <Route path="temporada-4" element={<Videos_Temporada4 />} />
      <Route path="temporada-5" element={<Videos_Temporada5 />} />

      {/* Dynamic section page for new sections */}
      <Route path="sections/:slug" element={<SectionPage />} />

      {/* Admin panel */}
      <Route path="admin/login" element={<AdminLogin />} />
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="sections" element={<AdminSections />} />
        <Route path="sections/new" element={<AdminSectionForm />} />
        <Route path="sections/:id/edit" element={<AdminSectionForm />} />
        <Route path="sections/:id/content" element={<AdminContent />} />
        <Route path="sections/:id/content/new" element={<AdminContentForm />} />
        <Route path="sections/:sectionId/content/:itemId/edit" element={<AdminContentForm />} />
      </Route>

      <Route path="/*" element={<Navigate to="/home" />} />
      <Route path="/podcast" element={<Navigate to="/temporada-1" />} />
    </Routes>
  );
};
