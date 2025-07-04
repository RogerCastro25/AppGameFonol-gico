import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users, Gamepad2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/phoneme', icon: Gamepad2, label: 'Fonemas' },
    { path: '/association', icon: Gamepad2, label: 'Associação' },
    { path: '/word-building', icon: Gamepad2, label: 'Palavras' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-purple-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">FonoJogos</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-purple-100 text-purple-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};