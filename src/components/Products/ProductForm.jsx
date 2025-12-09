import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { useAppContext } from "../../contexts/AppContext";

const ProductForm = () => {
  const { materials = [] } = useAppContext(); // lista de materiais, se existir
  const { criarItemReciclavel } = useApi(); // função da API

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    material: "",
    valorKilo: 0,
  });

  const [showForm, setShowForm] = useState(false);

  // 📩 Quando o usuário envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.nome && formData.material && formData.valorKilo > 0) {
      const result = await criarItemReciclavel(formData);

      if (result) {
        // ✅ sucesso
        setFormData({ nome: "", descricao: "", material: "", valorKilo: 0 });
        setShowForm(false);

        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
        notification.textContent = "Item reciclável cadastrado com sucesso!";
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
      } else {
        // ❌ erro
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
        notification.textContent = "Erro ao cadastrar item reciclável!";
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
      }
    } else {
      // 🚫 validação básica
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      notification.textContent = "Preencha todos os campos obrigatórios!";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  // 🖊️ Atualiza os dados conforme o usuário digita
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "valorKilo" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          <span>Novo Item Reciclável</span>
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cadastrar Novo Item Reciclável
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Item *
              </label>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Lata de alumínio"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material *
              </label>
              <select
                name="material"
                required
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione o material</option>
                {materials.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Valor por Kilo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Kilo (R$) *
              </label>
              <input
                type="number"
                name="valorKilo" // ✅ corrigido
                required
                min="0"
                step="0.01"
                value={formData.valorKilo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                rows={3}
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Descreva as características do item..."
              />
            </div>

            {/* Botões */}
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                <Save size={20} />
                <span>Salvar Item</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
