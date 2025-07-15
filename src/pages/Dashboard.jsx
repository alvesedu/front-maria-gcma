import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Shield, Crown, UserCheck, AlertTriangle, Database } from 'lucide-react';
import apiService from '../services/api';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user, hasPermission, isAdminOrSuperAdmin, canManageUsers, PERMISSIONS } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVictims: 136,
    lastVictim: null,
    totalAuthors: 113,
    lastAuthor: null,
    totalUsers: 0,
    lastUser: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas de vítimas
      if (hasPermission(PERMISSIONS.READ_VICTIM)) {
        try {
          const victims = await apiService.getVictimQuestionnaires();
          const victimsList = Array.isArray(victims) ? victims : [];
          setStats(prev => ({
            ...prev,
            totalVictims: victimsList.length,
            lastVictim: victimsList.length > 0 ? victimsList[victimsList.length - 1] : null
          }));
        } catch (error) {
          console.error('Erro ao buscar vítimas:', error);
        }
      }

      // Buscar estatísticas de autores
      if (hasPermission(PERMISSIONS.READ_AUTHOR)) {
        try {
          const authors = await apiService.getAuthorQuestionnaires();
          const authorsList = Array.isArray(authors) ? authors : [];
          setStats(prev => ({
            ...prev,
            totalAuthors: authorsList.length,
            lastAuthor: authorsList.length > 0 ? authorsList[authorsList.length - 1] : null
          }));
        } catch (error) {
          console.error('Erro ao buscar autores:', error);
        }
      }

      // Buscar estatísticas de usuários (apenas para Admin/SuperAdmin)
      if (hasPermission(PERMISSIONS.READ_USER)) {
        try {
          const users = await apiService.getUsers();
          const usersList = Array.isArray(users) ? users : [];
          setStats(prev => ({
            ...prev,
            totalUsers: usersList.length,
            lastUser: usersList.length > 0 ? usersList[usersList.length - 1] : null
          }));
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'admin':
        return <UserCheck className="h-4 w-4 text-blue-400" />;
      default:
        return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'superadmin': { label: 'Super Admin', variant: 'default' },
      'admin': { label: 'Admin', variant: 'secondary' },
      'user': { label: 'Usuário', variant: 'outline' }
    };
    
    const roleInfo = roleMap[role] || { label: 'Usuário', variant: 'outline' };
    
    return (
      <Badge variant={roleInfo.variant} className="flex items-center gap-1 bg-gray-700 text-gray-200">
        {getRoleIcon(role)}
        {roleInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      {/* Header com informações do usuário */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Sistema de Atendimento - Lei Maria da Penha
          </h1>
          <p className="text-gray-400 mt-2">
            Guarda Municipal de Ananindeua
          </p>
        </div>
        
        {/* User Info no Header */}
        {user && (
          <div className="flex items-center space-x-4 bg-gray-800 px-4 py-2 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user.nome || 'Usuário'}
              </p>
              <div className="flex items-center gap-2">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card Vítimas */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              QUANTIDADE
            </CardTitle>
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalVictims}</div>
            <p className="text-xs text-gray-400">
              Vítimas atendidas
            </p>
          </CardContent>
        </Card>

        {/* Card Placeholder 1 */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              QUANTIDADE
            </CardTitle>
            <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
              <Database className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-gray-400">
              Dados auxiliares
            </p>
          </CardContent>
        </Card>

        {/* Card Autores */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              QUANTIDADE
            </CardTitle>
            <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalAuthors}</div>
            <p className="text-xs text-gray-400">
              Autores registrados
            </p>
          </CardContent>
        </Card>

        {/* Card Usuários */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              QUANTIDADE
            </CardTitle>
            <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-gray-400">
              Usuários do sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Atividades */}
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Resumo de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Estatísticas de Vítimas */}
            {hasPermission(PERMISSIONS.READ_VICTIM) && (
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{stats.totalVictims}</div>
                <p className="text-gray-300 font-medium">Total de Vítimas Atendidas</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.lastVictim ? (
                    <>Última: {stats.lastVictim.nome}</>
                  ) : (
                    'Nenhuma vítima registrada'
                  )}
                </p>
              </div>
            )}
            
            {/* Estatísticas de Autores */}
            {hasPermission(PERMISSIONS.READ_AUTHOR) && (
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.totalAuthors}</div>
                <p className="text-gray-300 font-medium">Total de Autores Registrados</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.lastAuthor ? (
                    <>Último: {stats.lastAuthor.nome}</>
                  ) : (
                    'Nenhum autor registrado'
                  )}
                </p>
              </div>
            )}
            
            {/* Estatísticas de Usuários - apenas para Admin/SuperAdmin */}
            {hasPermission(PERMISSIONS.READ_USER) && (
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.totalUsers}</div>
                <p className="text-gray-300 font-medium">Total de Usuários</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.lastUser ? (
                    <>Último: {stats.lastUser.name || stats.lastUser.email}</>
                  ) : (
                    'Nenhum usuário registrado'
                  )}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Acesso */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Informações de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-300">Seu Perfil:</h4>
              <div className="flex items-center gap-2">
                {getRoleBadge(user?.role)}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-300">Permissões:</h4>
              <div className="text-sm text-gray-400">
                {isAdminOrSuperAdmin() ? (
                  <span className="text-green-400 font-medium">Acesso total ao sistema</span>
                ) : (
                  <span>Cadastro de vítimas e autores</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;

