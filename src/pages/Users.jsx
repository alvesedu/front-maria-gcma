import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Crown, UserCheck, Users as UsersIcon } from 'lucide-react';
import apiService from '../services/api';
import Layout from '../components/Layout';

const Users = () => {
  const { user: currentUser, hasPermission, PERMISSIONS } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'user'
  });
  const itemsPerPage = 6;

  useEffect(() => {
    if (hasPermission(PERMISSIONS.READ_USER)) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // A busca é feita localmente nos usuários já carregados
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'user'
    });
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome || '',
      email: user.email || '',
      senha: '', // Não preencher senha na edição
      role: user.role || 'user'
    });
    setShowForm(true);
  };

  const handleDeleteUser = async (id) => {
    // Verificar se não está tentando excluir a si mesmo
    if (currentUser && currentUser._id === id) {
      alert('Você não pode excluir sua própria conta.');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await apiService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Na edição, só enviar senha se foi preenchida
        const updateData = { ...formData };
        if (!updateData.senha) {
          delete updateData.senha;
        }
        await apiService.updateUser(editingUser._id, updateData);
      } else {
        await apiService.createUser(formData);
      }
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'admin':
        return <UserCheck className="h-4 w-4 text-blue-400" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'superadmin': { label: 'Super Admin', className: 'bg-yellow-600 text-white' },
      'admin': { label: 'Admin', className: 'bg-blue-600 text-white' },
      'user': { label: 'Usuário', className: 'bg-gray-600 text-white' }
    };
    
    const roleInfo = roleMap[role] || { label: 'Usuário', className: 'bg-gray-600 text-white' };
    
    return (
      <Badge className={`flex items-center gap-1 ${roleInfo.className}`}>
        {getRoleIcon(role)}
        {roleInfo.label}
      </Badge>
    );
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user =>
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Verificar se tem permissão para acessar esta página
  if (!hasPermission(PERMISSIONS.READ_USER)) {
    return (
      <Layout>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (showForm) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome
                  </label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Senha {editingUser && '(deixe em branco para manter a atual)'}
                  </label>
                  <Input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                    required={!editingUser}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Perfil
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 flex-1">
                    {editingUser ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            GERENCIAMENTO DE USUÁRIOS
          </h1>
        </div>

        {/* Search Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Digite sua pesquisa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
              <Button 
                onClick={handleAddUser}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Cards */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando usuários...</p>
          </div>
        ) : currentUsers.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">Nenhum usuário encontrado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUsers.map((user) => (
              <Card key={user._id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center justify-between">
                    Informações do Usuário
                    {getRoleBadge(user.role)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Nome:</p>
                    <p className="text-white font-medium">{user.nome || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Email:</p>
                    <p className="text-white">{user.email || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Data de Cadastro:</p>
                    <p className="text-white">{formatDate(user.created_at || user.createdAt)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="bg-yellow-600 hover:bg-yellow-700 flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={currentUser && currentUser._id === user._id}
                      className="bg-red-600 hover:bg-red-700 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Anterior
            </Button>
            
            <span className="text-gray-400">
              Página {currentPage} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;

