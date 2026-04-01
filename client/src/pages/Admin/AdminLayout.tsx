import { Outlet, NavLink, useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  LogOut,
} from 'lucide-react';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex text-white">
      <aside className="w-52 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-2 shrink-0">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-blue-400">Admin CMS</h2>
          <p className="text-xs text-gray-500">Security Awareness</p>
        </div>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
          }
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/sections"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
          }
        >
          <Layers size={16} />
          Secciones
        </NavLink>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors w-full cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
