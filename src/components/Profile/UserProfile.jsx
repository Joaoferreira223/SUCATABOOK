import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Shield, Calendar, Edit, Save, X, Camera } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Aqui você pode integrar com a API para salvar as alterações
    console.log('Salvando dados do usuário:', formData);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Perfil atualizado com sucesso!';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      role: user?.role || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Perfil do Usuário</h3>
          {!isEditing ? (
          <button
  onClick={() => {
    window.open(
      "https://youtu.be/srvxMN0UsYo?si=rDYdBZW0XwJqRdxT",
      "_blank"
    );
  }}
  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
>
  <Edit size={16} />
  <span>Editar</span>
</button>

          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Save size={16} />
                <span>Salvar</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-emerald-600" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-900">{user?.username}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Nível de Acesso</p>
                  <p className="text-sm text-gray-600">Permissões do usuário</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Membro desde</p>
                  <p className="text-sm text-gray-600">Data de criação da conta</p>
                </div>
              </div>
              <span className="text-sm text-gray-900">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-medium text-emerald-800 mb-2">Status da Conta</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-emerald-700">Conta Ativa</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Último Acesso</h4>
              <p className="text-sm text-blue-700">
                {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Alterar Senha</h4>
              <p className="text-sm text-gray-500">Atualize sua senha regularmente</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Alterar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Autenticação em Duas Etapas</h4>
              <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Sessões Ativas</h4>
              <p className="text-sm text-gray-500">Gerencie seus dispositivos conectados</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Ver Sessões
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Login realizado com sucesso</p>
              <p className="text-xs text-gray-500">{new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Produto cadastrado</p>
              <p className="text-xs text-gray-500">Há 2 horas</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Compra registrada</p>
              <p className="text-xs text-gray-500">Há 4 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
