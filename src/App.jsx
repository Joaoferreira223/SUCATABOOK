import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ProductForm from './components/Products/ProductForm';
import ProductList from './components/Products/ProductList';
import PurchaseForm from './components/Purchases/PurchaseForm';
import PurchaseList from './components/Purchases/PurchaseList';
import FinancialSummary from './components/Financial/FinancialSummary';
import Settings from './components/Settings/Settings';
import UserProfile from './components/Profile/UserProfile';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  if (!isAuthenticated) return <LoginForm />;

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <ProductForm />
            <ProductList />
          </div>
        );
      case 'purchases':
        return (
          <div className="space-y-6">
            <PurchaseForm />
            <PurchaseList />
          </div>
        );
      case 'financial':
        return <FinancialSummary />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo ao SucataBook</h2>
            <p className="text-gray-600 mt-2">
              Selecione uma opção no menu lateral para começar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        {/* ❌ ChatPulse removido */}
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
