import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Edit, Trash2, Package, Save } from 'lucide-react';

const ProductList = () => {
  const { getItensReciclaveis, atualizarItemReciclavel, deletarItemReciclavel } = useApi();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nome: '', material: '', valorKilo: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getItensReciclaveis();
      setProducts(response?.data || []);
    } catch (error) {
      console.error('Erro ao carregar itens recicláveis:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Excluir item
 const handleDelete = async (id) => {
  if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
  
  try {
    const response = await deletarItemReciclavel(id);

    // ✅ verifica se o backend retornou sucesso
    if (response && !response.error) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert('Erro ao excluir no servidor.');
      console.error('Erro ao excluir no backend:', response.error);
    }
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    alert('Erro ao excluir item no servidor.');
  }
};


  // 🔹 Editar item
  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      nome: product.nome,
      material: product.material,
      valorKilo: product.valorKilo,
    });
  };

  // 🔹 Salvar edição
  const handleSave = async (id) => {
    try {
      const updated = await atualizarItemReciclavel(id, editForm);
      if (updated?.data) {
        setProducts((prev) =>
          prev.map((item) => (item.id === id ? updated.data : item))
        );
      }
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  // 🔹 Atualizar campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Carregando itens recicláveis...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Package size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item cadastrado</h3>
        <p className="text-gray-600">Comece cadastrando seus primeiros materiais recicláveis.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Itens Recicláveis Cadastrados</h3>
        <p className="text-sm text-gray-600 mt-1">{products.length} item(ns) no sistema</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor/Kg</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {editingId === product.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        name="nome"
                        value={editForm.nome}
                        onChange={handleChange}
                        className="border rounded p-1 text-sm w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        name="material"
                        value={editForm.material}
                        onChange={handleChange}
                        className="border rounded p-1 text-sm w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        name="valorKilo"
                        type="number"
                        step="0.01"
                        value={editForm.valorKilo}
                        onChange={handleChange}
                        className="border rounded p-1 text-sm w-24"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSave(product.id)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <Save size={16} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.material}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      R$ {parseFloat(product.valorKilo || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
