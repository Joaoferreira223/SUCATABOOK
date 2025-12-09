import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Calculator, Save, Plus, Trash2, ShoppingCart } from 'lucide-react';

const PurchaseForm = () => {
  const { products, addPurchase, loading } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [calculatedValues, setCalculatedValues] = useState({
    totalValue: 0,
    totalWeight: 0,
    totalProfit: 0,
    profitPercentage: 0,
  });

  // Converte produtos para números e garante preço válido
  const productsWithNumbers = Array.isArray(products)
  ? products.map(p => ({
      ...p,
      id: Number(p.id),
      // tenta vários nomes comuns usados no backend
      preco:
        Number(
          p.preco ??
          p.valorKilo ??
          p.valor_kilo ??
          p.precoKilo ??
          p.preco_kilo ??
          0
        ) || 0,
    }))
  : [];


  useEffect(() => {
    const totalValue = items.reduce((sum, item) => sum + (item.itemValue || 0), 0);
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);
    const totalProfit = totalPaid > 0 ? totalValue - totalPaid : 0;
    const profitPercentage = totalPaid > 0 ? (totalProfit / totalPaid) * 100 : 0;

    setCalculatedValues({ totalValue, totalWeight, totalProfit, profitPercentage });
  }, [items, totalPaid]);

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { productId: '', productName: '', material: '', weight: 0, valorKilo: 0, itemValue: 0 },
    ]);
  };

  const removeItem = index => setItems(prev => prev.filter((_, i) => i !== index));

  const updateItem = (index, field, value) => {
    setItems(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item };

          // Atualiza produto
          if (field === 'productId') {
            const productIdNum = Number(value);
            const product = productsWithNumbers.find(p => p.id === productIdNum);
            updatedItem.productId = productIdNum;

            if (product) {
              updatedItem.productName = product.nome || '';
              updatedItem.material = product.material || '';
              updatedItem.valorKilo = product.preco; // já é número
            } else {
              updatedItem.productName = '';
              updatedItem.material = '';
              updatedItem.valorKilo = 0;
            }
          }

          // Atualiza peso
          if (field === 'weight') {
            updatedItem.weight = Number(value) || 0;
          }

          // Recalcula itemValue
          updatedItem.itemValue = (updatedItem.weight || 0) * (updatedItem.valorKilo || 0);

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (items.length === 0 || totalPaid <= 0) {
      alert('Adicione pelo menos um item e informe o valor pago.');
      return;
    }

    const validItems = items.filter(item => item.productId && item.weight > 0);
    if (validItems.length === 0) {
      alert('Todos os itens devem ter produto selecionado e peso maior que zero.');
      return;
    }

    addPurchase({
      items: validItems,
      totalWeight: calculatedValues.totalWeight,
      totalValue: calculatedValues.totalValue,
      totalPaid,
      totalProfit: calculatedValues.totalProfit,
    });

    setItems([]);
    setTotalPaid(0);
    setShowForm(false);

    const notification = document.createElement('div');
    notification.className =
      'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Compra registrada com sucesso!';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  if (loading) return <div className="p-4 text-gray-600 text-center">Carregando produtos...</div>;
  if (!loading && products.length === 0)
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800">
          Você precisa cadastrar pelo menos um produto antes de registrar compras.
        </p>
      </div>
    );

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nova Compra</span>
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Nova Compra</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Itens da Compra</h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>Adicionar Item</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <ShoppingCart size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhum item adicionado</p>
                  <button
                    type="button"
                    onClick={addItem}
                    className="mt-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Clique para adicionar o primeiro item
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                          <select
                            value={item.productId}
                            onChange={e => updateItem(index, 'productId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Selecione</option>
                            {productsWithNumbers.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.nome} - R$ {product.preco.toFixed(2)}/kg
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={item.weight}
                            onChange={e => updateItem(index, 'weight', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Item (R$)</label>
                          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-mono">
                            R$ {item.itemValue.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-lg transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 size={16} />
                            <span>Remover</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalPaid" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Total Pago (R$) *
                </label>
                <input
                  type="number"
                  id="totalPaid"
                  min="0"
                  step="0.01"
                  value={totalPaid}
                  onChange={e => setTotalPaid(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {items.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Calculator size={20} className="text-blue-600" />
                  <h4 className="font-medium text-gray-900">Resumo da Compra</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Peso Total</label>
                    <p className="text-lg font-mono font-semibold text-gray-900">
                      {calculatedValues.totalWeight.toFixed(1)} kg
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Valor Total Estimado</label>
                    <p className="text-lg font-mono font-semibold text-gray-900">
                      R$ {calculatedValues.totalValue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Lucro Estimado</label>
                    <p
                      className={`text-lg font-mono font-semibold ${
                        calculatedValues.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      R$ {calculatedValues.totalProfit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Margem de Lucro</label>
                    <p
                      className={`text-lg font-mono font-semibold ${
                        calculatedValues.profitPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {calculatedValues.profitPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setItems([]);
                  setTotalPaid(0);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={20} />
                <span>Registrar Compra</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PurchaseForm;
