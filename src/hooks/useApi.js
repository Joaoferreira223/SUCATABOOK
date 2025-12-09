import React, { useState } from 'react';

/**
 * Custom hook para chamadas à API
 * Integrado ao AuthContext
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // 🔹 Pega token do localStorage
  const getToken = () => localStorage.getItem('sucatabook_token');

  // 🔹 Função genérica para chamadas à API
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();

      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

      console.log('URL do fetch:', url);
      console.log('Config do fetch:', config);

      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('Token inválido ou expirado. Limpando token.');
          localStorage.removeItem('sucatabook_token');
          localStorage.removeItem('sucatabook_user');
        }
        throw new Error(`Erro HTTP: ${response.status}`);
      }

     let result = null;

// ✅ Só tenta converter pra JSON se houver conteúdo
if (response.status !== 204) {
  const text = await response.text();
  result = text ? JSON.parse(text) : null;
}

setLoading(false);
return { data: result, loading: false, error: null };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setLoading(false);
      return { data: null, loading: false, error: errorMessage };
    }
  };

  return {
    loading,
    error,

    // 🔹 Itens Recicláveis
    getItensReciclaveis: () => apiCall('/api/itens_reciclaveis'),
    criarItemReciclavel: (item) => apiCall('/api/itens_reciclaveis', 'POST', item),
    atualizarItemReciclavel: (id, item) => apiCall(`/api/itens_reciclaveis/${id}`, 'PUT', item),
    deletarItemReciclavel: (id) => apiCall(`/api/itens_reciclaveis/${id}`, 'DELETE'),
    
    // 🔹 Compras
   getCompras: () => apiCall('/api/compras'),

criarCompra: (compra) => apiCall('/api/compras', 'POST', compra),

getComprasPorPeriodo: (startDate, endDate) => {
  const params = new URLSearchParams();

  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const queryString = params.toString();
  const url = queryString ? `/api/compras?${queryString}` : '/api/compras';

  return apiCall(url);
},


    // 🔹 Financeiro
    getResumoFinanceiro: (startDate, endDate) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      return apiCall(`/api/financial/summary?${params.toString()}`);
    },

    // 🔹 Login
    login: async ({ email, senha }) => {
      const response = await apiCall('/auth/login', 'POST', { email, senha });

      if (response.data?.token) {
        localStorage.setItem('sucatabook_token', response.data.token);

        const loggedUser = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
        };
        localStorage.setItem('sucatabook_user', JSON.stringify(loggedUser));
      }

      return response;
    },
  };
};
