import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Definição dos papéis e permissões
  const USER_ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin', 
    USER: 'user'
  };

  const PERMISSIONS = {
    // Permissões para usuários
    CREATE_USER: 'create_user',
    READ_USER: 'read_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',
    
    // Permissões para vítimas
    CREATE_VICTIM: 'create_victim',
    READ_VICTIM: 'read_victim',
    UPDATE_VICTIM: 'update_victim',
    DELETE_VICTIM: 'delete_victim',
    
    // Permissões para autores
    CREATE_AUTHOR: 'create_author',
    READ_AUTHOR: 'read_author',
    UPDATE_AUTHOR: 'update_author',
    DELETE_AUTHOR: 'delete_author',
    
    // Permissões especiais
    VIEW_DASHBOARD: 'view_dashboard',
    PRINT_REPORTS: 'print_reports'
  };

  // Mapeamento de permissões por papel
  const ROLE_PERMISSIONS = {
    [USER_ROLES.SUPERADMIN]: Object.values(PERMISSIONS), // Todas as permissões
    [USER_ROLES.ADMIN]: Object.values(PERMISSIONS), // Todas as permissões
    [USER_ROLES.USER]: [
      PERMISSIONS.CREATE_VICTIM,
      PERMISSIONS.READ_VICTIM,
      PERMISSIONS.UPDATE_VICTIM,
      PERMISSIONS.DELETE_VICTIM,
      PERMISSIONS.CREATE_AUTHOR,
      PERMISSIONS.READ_AUTHOR,
      PERMISSIONS.UPDATE_AUTHOR,
      PERMISSIONS.DELETE_AUTHOR,
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.PRINT_REPORTS
    ]
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

 const login = async ({ email, senha }) => {
  //console.log("Enviando login com:", email, senha);
  try {
    const response = await apiService.login({ email, senha });

    if (response.token) {
      localStorage.setItem("token", response.token);

      // Decodificar o token JWT para extrair as informações do usuário
      const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
      
      const userData = {
        _id: tokenPayload.userId,
        email: email,
        role: tokenPayload.role, // Usar o role do token JWT
        ...response.user
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    }

    return { success: false, error: "Token não recebido" };
  } catch (error) {
    console.error("Erro no login:", error);
    return { success: false, error: "Erro ao fazer login" };
  }
};


  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro ao registrar usuário' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  // Função para verificar se o usuário tem um papel específico
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Função para verificar se o usuário é admin ou superadmin
  const isAdminOrSuperAdmin = () => {
    return hasRole(USER_ROLES.ADMIN) || hasRole(USER_ROLES.SUPERADMIN);
  };

  // Função para verificar se o usuário pode gerenciar usuários
  const canManageUsers = () => {
    return hasPermission(PERMISSIONS.CREATE_USER) && 
           hasPermission(PERMISSIONS.UPDATE_USER) && 
           hasPermission(PERMISSIONS.DELETE_USER);
  };


  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    isAdminOrSuperAdmin,
    canManageUsers,
    USER_ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

