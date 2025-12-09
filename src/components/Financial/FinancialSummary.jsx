import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { DollarSign, TrendingUp, Weight, BarChart3 } from 'lucide-react';

const FinancialSummary = () => {
  const { getFinancialSummary } = useAppContext();
  const summary = getFinancialSummary();

  const stats = [
    {
      title: 'Total de Compras',
      value: summary.totalPurchases.toString(),
      icon: BarChart3,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Receita Total',
      value: `R$ ${summary.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'emerald',
      change: '+8.2%'
    },
    {
      title: 'Lucro Total',
      value: `R$ ${summary.totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: summary.totalProfit >= 0 ? 'emerald' : 'red',
      change: summary.totalProfit >= 0 ? '+15.3%' : '-3.2%'
    },
    {
      title: 'Peso Total',
      value: `${summary.totalWeight.toFixed(1)} kg`,
      icon: Weight,
      color: 'purple',
      change: '+22.1%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">vs mês anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Detalhadas</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Lucro Médio por Compra</span>
              <span className="text-sm font-semibold text-gray-900">
                R$ {summary.averageProfit.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Peso Médio por Compra</span>
              <span className="text-sm font-semibold text-gray-900">
                {summary.totalPurchases > 0 ? (summary.totalWeight / summary.totalPurchases).toFixed(1) : '0.0'} kg
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Margem de Lucro Média</span>
              <span className={`text-sm font-semibold ${
                summary.totalRevenue > 0 && summary.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {summary.totalRevenue > 0 ? ((summary.totalProfit / summary.totalRevenue) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600">Valor Médio por Kg</span>
              <span className="text-sm font-semibold text-gray-900">
                R$ {summary.totalWeight > 0 ? (summary.totalRevenue / summary.totalWeight).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Financeiro</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-emerald-800">Sistema Operacional</span>
              </div>
              <p className="text-sm text-emerald-600 mt-1">
                Ferro-velho funcionando normalmente
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Dados Sincronizados</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
            
            {summary.totalProfit >= 0 ? (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Lucro Positivo</span>
                </div>
                <p className="text-sm text-emerald-600 mt-1">
                  O negócio está gerando lucro
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <TrendingUp size={16} className="text-red-600" />
                  <span className="text-sm font-medium text-red-800">Atenção aos Custos</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Revisar estratégia de preços
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;