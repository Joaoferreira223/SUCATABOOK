import React from 'react';
import { Bell, User, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ activeTab }) => {
  const { user, logout } = useAuth();

  const getTitle = (tab) => {
    switch (tab) {
      case 'products': return 'Cadastro de Produtos';
      case 'purchases': return 'Controle de Compras';
      case 'financial': return 'Balanço Financeiro';
      case 'profile': return 'Perfil do Usuário';
      case 'settings': return 'Configurações';
      default: return 'SucataBook';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{getTitle(activeTab)}</h2>
          <p className="text-gray-600 text-sm mt-1">Gerencie seu ferro-velho com eficiência</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 p-2 text-gray-700">
              <User size={20} />
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;