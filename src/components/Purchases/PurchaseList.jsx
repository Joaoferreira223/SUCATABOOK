import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { ShoppingCart, TrendingUp, TrendingDown, Package } from 'lucide-react';

const PurchaseList = () => {
  const { purchases } = useAppContext();

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma compra registrada</h3>
        <p className="text-gray-600">Registre suas primeiras compras de sucata.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Histórico de Compras</h3>
        <p className="text-sm text-gray-600 mt-1">{purchases.length} compra(s) registrada(s)</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {purchases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((purchase) => (
          <div key={purchase.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Compra #{purchase.id.slice(-6)}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(purchase.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(purchase.createdAt).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {purchase.totalProfit >= 0 ? (
                    <TrendingUp size={16} className="text-emerald-600" />
                  ) : (
                    <TrendingDown size={16} className="text-red-600" />
                  )}
                  <span className={`text-lg font-mono font-semibold ${
                    purchase.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    R$ {purchase.totalProfit.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Lucro</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <Package size={16} />
                <span>Itens ({purchase.items.length})</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {purchase.items.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.material}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-gray-900">
                          {item.weight.toFixed(1)} kg
                        </p>
                        <p className="text-xs font-mono text-gray-600">
                          R$ {item.itemValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Peso Total</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  {purchase.totalWeight.toFixed(1)} kg
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valor Estimado</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  R$ {purchase.totalValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valor Pago</p>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  R$ {purchase.totalPaid.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Margem</p>
                <p className={`text-sm font-mono font-semibold ${
                  purchase.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {purchase.totalPaid > 0 ? ((purchase.totalProfit / purchase.totalPaid) * 100).toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseList;