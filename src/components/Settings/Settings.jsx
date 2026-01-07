import React, { useRef } from 'react';
import { Cloud, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const fileInputRef = useRef(null);

  // Exportar dados Excel
  const handleExport = async () => {
    try {
     const response = await fetch(
  'https://api-tcc-1yg8.onrender.com/api/itens_reciclaveis/exportar');
      if (!response.ok) throw new Error('Erro ao exportar dados');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'itens_reciclaveis.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Falha ao exportar os dados');
    }
  };

  // Importar dados Excel
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/itens_reciclaveis/importar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro ao importar dados');

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error(error);
      alert('Falha ao importar os dados');
    } finally {
      fileInputRef.current.value = null; // limpa o input
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Cloud size={20} />
          <span>Sincronização de Dados</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Sincronização Automática</h4>
              <p className="text-sm text-gray-500">Enviar dados automaticamente para a API</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Backup Local</h4>
              <p className="text-sm text-gray-500">Manter dados salvos localmente</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Exportar Dados
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Importar Dados
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* O restante do componente permanece exatamente igual */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <SettingsIcon size={20} />
          <span>Configurações Gerais</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Ferro-velho
            </label>
            <input
              type="text"
              placeholder="Digite o nome do seu ferro-velho"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeda
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="BRL">Real Brasileiro (R$)</option>
              <option value="USD">Dólar Americano ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/Rio_de_Janeiro">Rio de Janeiro (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
            </select>
          </div>

          <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
