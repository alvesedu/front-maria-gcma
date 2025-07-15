import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Shield, 
  FileText, 
  Users,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, hasPermission, PERMISSIONS, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Painel',
      icon: LayoutDashboard,
      path: '/dashboard',
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    {
      title: 'Vítima',
      icon: Shield,
      path: '/victims',
      permission: PERMISSIONS.READ_VICTIM
    },
    {
      title: 'Agressor',
      icon: FileText,
      path: '/authors',
      permission: PERMISSIONS.READ_AUTHOR
    },
    {
      title: 'Usuários',
      icon: Users,
      path: '/users',
      permission: PERMISSIONS.READ_USER
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-screen">
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">GM</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">
              Sistema GCMA
            </h1>
            <p className="text-xs text-gray-400">
              Maria da Penha
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // Verifica se o usuário tem permissão para ver este item
            if (item.permission && !hasPermission(item.permission)) {
              return null;
            }

            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      {user && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">
                {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.nome || 'Usuário'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.role === 'superadmin' ? 'Super Admin' : 
                 user.role === 'admin' ? 'Admin' : 'Usuário'}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

