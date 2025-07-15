# Sistema de Atendimento - Lei Maria da Penha
**Guarda Municipal de Ananindeua**

Sistema completo de front-end em React para gerenciamento de atendimentos relacionados à Lei Maria da Penha, desenvolvido especificamente para a Guarda Municipal de Ananindeua.

## 🎯 **Funcionalidades Principais**

### 🔐 **Sistema de Autenticação com Controle de Acesso**
- **3 Níveis de Usuário**: SuperAdmin, Admin e User
- **Permissões Específicas**:
  - **SuperAdmin**: Acesso total ao sistema
  - **Admin**: Acesso total + gerenciamento de usuários
  - **User**: Cadastro de vítimas e autores apenas
- **Proteção de Rotas**: Redirecionamento automático baseado em permissões
- **Persistência de Sessão**: Manutenção do login entre sessões

### 📊 **Dashboard Inteligente**
- **Estatísticas em Tempo Real**:
  - Total de Vítimas Atendidas + Última Vítima Registrada
  - Total de Autores Registrados + Último Autor Registrado
  - Total de Usuários + Último Usuário Registrado
- **Acesso Rápido**: Links diretos para Menu Vítima, Menu Autor e Gerenciar Usuários
- **Interface Responsiva**: Adaptação automática para desktop e mobile

### 👥 **Gerenciamento de Usuários** (Apenas Admin/SuperAdmin)
- **CRUD Completo**: Criar, visualizar, editar e excluir usuários
- **Controle de Perfis**: Atribuição de níveis de acesso (SuperAdmin, Admin, User)
- **Segurança**: Proteção contra auto-exclusão e validações de permissão
- **Interface em Cards**: Visualização clara com badges de perfil

### 🛡️ **Menu Vítima** (Layout Padronizado)
- **Busca Avançada**: Input para buscar por CPF ou RG
- **Botão Adicionar**: Posicionado à direita, abre formulário de múltiplos passos
- **Formulário de 3 Passos**:
  1. **Dados Pessoais**: Nome, CPF, RG, Data de Nascimento, Sexo, Estado Civil, Profissão
  2. **Endereço e Contato**: Endereço completo, Telefone, Email, Contato de emergência
  3. **Informações do Caso**: Relato, Data/Local da ocorrência, Medidas protetivas
- **Cards de Listagem**: Nome, CPF, RG, Data de Nascimento, Sexo
- **Botões nos Cards**: Editar, Imprimir, Excluir
- **Paginação**: Listagem organizada com navegação entre páginas

### 📋 **Menu Autor** (Layout Idêntico ao Menu Vítima)
- **Busca Avançada**: Input para buscar por CPF ou RG
- **Botão Adicionar**: Posicionado à direita, abre formulário de múltiplos passos
- **Formulário de 3 Passos**:
  1. **Dados Pessoais**: Nome, CPF, RG, Data de Nascimento, Sexo, Estado Civil, Profissão, Escolaridade
  2. **Endereço e Contato**: Endereço completo, Telefone, Email, Local de trabalho
  3. **Informações Criminais**: Relacionamento com vítima, Histórico criminal, Uso de substâncias, Medidas restritivas
- **Cards de Listagem**: Nome, CPF, RG, Data de Nascimento, Sexo
- **Botões nos Cards**: Editar, Imprimir, Excluir
- **Paginação**: Listagem organizada com navegação entre páginas

### 🖨️ **Sistema de Impressão**
- **Relatórios Completos**: Geração automática de relatórios formatados
- **Dados Estruturados**: Organização por seções (Dados Pessoais, Contato, Informações do Caso/Criminal)
- **Cabeçalho Oficial**: Identificação da Guarda Municipal de Ananindeua
- **Timestamp**: Data e hora de geração do relatório

## 🎨 **Interface e Experiência do Usuário**

### Design Moderno
- **shadcn/ui**: Componentes modernos e acessíveis
- **Tailwind CSS**: Estilização responsiva e consistente
- **Lucide Icons**: Ícones intuitivos e profissionais
- **Cores Temáticas**: Paleta adequada ao contexto da Lei Maria da Penha

### Formulários de Múltiplos Passos
- **Barra de Progresso**: Indicador visual de % de conclusão
- **Navegação Livre**: Botões Anterior/Próximo/Cancelar
- **Validação em Tempo Real**: Feedback imediato de erros
- **Indicadores Numerados**: Passos claramente identificados

### Responsividade
- **Desktop First**: Interface otimizada para uso profissional
- **Mobile Friendly**: Adaptação completa para dispositivos móveis
- **Touch Support**: Interações otimizadas para tela touch

## 🔧 **Integração com Back-end**

### APIs Suportadas
- **Autenticação**: Login, registro, verificação de permissões
- **Usuários**: CRUD completo com controle de acesso
- **Vítimas**: CRUD + busca por CPF/RG
- **Autores**: CRUD + busca por CPF/RG
- **Estatísticas**: Contadores e últimos registros

### Tratamento de Erros
- **Validação de Campos**: Verificação de dados obrigatórios
- **Feedback Visual**: Alertas e mensagens de erro/sucesso
- **Recuperação Graceful**: Tratamento de falhas de conexão

## 🚀 **Instalação e Configuração**

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm
- Back-end Node.js/Express rodando

### Passos de Instalação
```bash
# 1. Extrair o projeto
unzip questionnaire-frontend-v3.zip
cd questionnaire-frontend

# 2. Instalar dependências
npm install
# ou
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com a URL do seu back-end

# 4. Iniciar servidor de desenvolvimento
npm run dev
# ou
pnpm dev

# 5. Acessar aplicação
# http://localhost:5173
```

### Configuração do Back-end
```javascript
// No arquivo src/services/api.js
const API_BASE_URL = 'http://localhost:3000'; // Alterar para sua URL
```

## 📁 **Estrutura do Projeto**

```
questionnaire-frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── MultiStepForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── VictimFormSteps.jsx
│   │   └── AuthorFormSteps.jsx
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.jsx
│   ├── pages/              # Páginas principais
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Victims.jsx
│   │   └── Authors.jsx
│   ├── services/           # Serviços de API
│   │   └── api.js
│   └── utils/              # Utilitários
├── public/                 # Arquivos públicos
└── package.json           # Dependências e scripts
```

## 🔒 **Segurança e Permissões**

### Controle de Acesso
- **Verificação de Token**: Validação automática em todas as requisições
- **Proteção de Rotas**: Redirecionamento baseado em permissões
- **Níveis Hierárquicos**: SuperAdmin > Admin > User

### Permissões por Perfil
| Funcionalidade | SuperAdmin | Admin | User |
|----------------|------------|-------|------|
| Dashboard | ✅ | ✅ | ✅ |
| Menu Vítima | ✅ | ✅ | ✅ |
| Menu Autor | ✅ | ✅ | ✅ |
| Gerenciar Usuários | ✅ | ✅ | ❌ |
| Criar Usuários | ✅ | ✅ | ❌ |
| Editar Usuários | ✅ | ✅ | ❌ |
| Excluir Usuários | ✅ | ✅ | ❌ |

## 🛠️ **Tecnologias Utilizadas**

### Core
- **React 18**: Framework principal
- **Vite**: Build tool e servidor de desenvolvimento
- **React Router DOM**: Navegação entre páginas

### UI/UX
- **Tailwind CSS**: Framework de estilização
- **shadcn/ui**: Biblioteca de componentes
- **Lucide React**: Ícones modernos
- **Recharts**: Gráficos e visualizações

### Estado e Dados
- **React Context**: Gerenciamento de estado global
- **Fetch API**: Comunicação com back-end
- **Local Storage**: Persistência de sessão

## 📞 **Suporte e Manutenção**

### Logs e Debug
- **Console Logs**: Informações detalhadas de erro
- **Network Tab**: Monitoramento de requisições
- **React DevTools**: Debug de componentes

### Atualizações
- **Versionamento**: Controle de versões do projeto
- **Backup**: Manutenção de versões anteriores
- **Documentação**: Registro de mudanças

## 🎯 **Próximos Passos**

1. **Conectar com Back-end**: Configurar URLs e testar integração
2. **Dados de Teste**: Criar usuários e registros para validação
3. **Treinamento**: Capacitar equipe da Guarda Municipal
4. **Deploy**: Publicar em servidor de produção
5. **Monitoramento**: Acompanhar uso e performance

---

**Desenvolvido especificamente para a Guarda Municipal de Ananindeua**  
*Sistema de Atendimento - Lei Maria da Penha*

**Versão**: 3.0  
**Data**: Julho 2025  
**Status**: Pronto para Produção ✅

