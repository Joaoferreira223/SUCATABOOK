import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'purchases', label: 'Compras', icon: ShoppingCart },
    { id: 'financial', label: 'Financeiro', icon: BarChart3 },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div
      className={`bg-gray-900 text-white min-h-screen flex flex-col transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">
              SucataBook
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Sistema de Gestão
            </p>
          </div>
        )}

        {/* Botão de toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all
                    ${collapsed ? 'justify-center' : 'space-x-3'}
                    ${
                      activeTab === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            © 2025 SucataBook
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
