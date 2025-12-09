import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8080'; // ajuste conforme sua API

  const materials = [
    'Ferro', 'Alumínio', 'Cobre', 'Bronze', 'Latão',
    'Aço Inox', 'Chumbo', 'Zinco', 'Níquel', 'Outros Metais'
  ];

  const getToken = () => localStorage.getItem('sucatabook_token');

  const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    if (!token) console.warn('⚠️ Token não encontrado no localStorage');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
    return fetch(url, { ...options, headers });
  };

  // =============================
  // 🔹 FUNÇÕES DE INTEGRAÇÃO API
  // =============================

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/itens_reciclaveis`);
      if (!res.ok) throw new Error('Erro ao buscar produtos');
      const data = await res.json();
      setProducts(data);
      localStorage.setItem('sucatabook_products', JSON.stringify(data));
    } catch (err) {
      console.error('⚠️ Erro ao buscar produtos:', err);
      const saved = localStorage.getItem('sucatabook_products');
      if (saved) setProducts(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/compras`);
      if (!res.ok) throw new Error('Erro ao buscar compras');
      const data = await res.json();

      const parsed = data.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }));

      setPurchases(parsed);
      localStorage.setItem('sucatabook_purchases', JSON.stringify(parsed));
    } catch (err) {
      console.error('⚠️ Erro ao buscar compras:', err);
      const saved = localStorage.getItem('sucatabook_purchases');
      if (saved) setPurchases(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    const newProduct = { ...productData, createdAt: new Date() };
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/itens_reciclaveis`, {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Erro ao salvar produto');
      const savedProduct = await res.json();

      setProducts(prev => {
        const updated = [...prev, savedProduct];
        localStorage.setItem('sucatabook_products', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('⚠️ Falha ao salvar produto, usando fallback local:', err);
      newProduct.id = Date.now().toString();
      setProducts(prev => {
        const updated = [...prev, newProduct];
        localStorage.setItem('sucatabook_products', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const addPurchase = async (purchaseData) => {
    const newPurchase = { ...purchaseData, createdAt: new Date() };
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/compras`, {
        method: 'POST',
        body: JSON.stringify(newPurchase),
      });
      if (!res.ok) throw new Error('Erro ao salvar compra');
      const savedPurchase = await res.json();

      setPurchases(prev => {
        const updated = [...prev, savedPurchase];
        localStorage.setItem('sucatabook_purchases', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('⚠️ Falha ao salvar compra, usando fallback local:', err);
      newPurchase.id = Date.now().toString();
      setPurchases(prev => {
        const updated = [...prev, newPurchase];
        localStorage.setItem('sucatabook_purchases', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // =============================
  // 🔹 INICIALIZAÇÃO
  // =============================
  useEffect(() => {
    fetchProducts();
    fetchPurchases();
  }, []);

  // =============================
  // 🔹 SUMÁRIO FINANCEIRO
  // =============================
  const getFinancialSummary = () => {
    const totalPurchases = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.totalPaid || 0), 0);
    const totalProfit = purchases.reduce((sum, p) => sum + (p.totalProfit || 0), 0);
    const totalWeight = purchases.reduce((sum, p) => sum + (p.totalWeight || 0), 0);
    const averageProfit = totalPurchases > 0 ? totalProfit / totalPurchases : 0;

    return { totalPurchases, totalRevenue, totalProfit, totalWeight, averageProfit };
  };

  return (
    <AppContext.Provider
      value={{
        products,
        purchases,
        addProduct,
        addPurchase,
        getFinancialSummary,
        materials,
        loading,
        fetchPurchases,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
