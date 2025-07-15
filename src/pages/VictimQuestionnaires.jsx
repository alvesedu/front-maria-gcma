import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Shield, Search, User, FileText } from 'lucide-react';

const VictimQuestionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [searchData, setSearchData] = useState({
    cpf: '',
    rg: '',
  });
  const [searchResult, setSearchResult] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    endereco: '',
    telefone: '',
    relato: '',
    medidas_protetivas: '',
    observacoes: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVictimQuestionnaires();
      setQuestionnaires(response);
    } catch (error) {
      setError('Erro ao carregar atendimentos');
      console.error('Erro ao buscar atendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchData.cpf && !searchData.rg) {
      setSearchError('Informe o CPF ou RG para realizar a busca');
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError('');
      const response = await apiService.searchVictimQuestionnaire(searchData.cpf, searchData.rg);
      setSearchResult(response);
    } catch (error) {
      setSearchError('Atendimento não encontrado');
      setSearchResult(null);
      console.error('Erro na busca:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.cpf) {
      setError('Nome e CPF são obrigatórios');
      return;
    }

    try {
      if (editingQuestionnaire) {
        await apiService.updateVictimQuestionnaire(editingQuestionnaire.id, formData);
      } else {
        await apiService.createVictimQuestionnaire(formData);
      }
      
      setIsDialogOpen(false);
      setEditingQuestionnaire(null);
      setFormData({ nome: '', cpf: '', rg: '', endereco: '', telefone: '', relato: '', medidas_protetivas: '', observacoes: '' });
      setError('');
      fetchQuestionnaires();
    } catch (error) {
      setError('Erro ao salvar atendimento');
      console.error('Erro ao salvar atendimento:', error);
    }
  };

  const handleEdit = (questionnaire) => {
    setEditingQuestionnaire(questionnaire);
    setFormData({
      nome: questionnaire.nome || '',
      cpf: questionnaire.cpf || '',
      rg: questionnaire.rg || '',
      endereco: questionnaire.endereco || '',
      telefone: questionnaire.telefone || '',
      relato: questionnaire.relato || '',
      medidas_protetivas: questionnaire.medidas_protetivas || '',
      observacoes: questionnaire.observacoes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (questionnaireId) => {
    if (window.confirm('Tem certeza que deseja excluir este atendimento?')) {
      try {
        await apiService.deleteVictimQuestionnaire(questionnaireId);
        fetchQuestionnaires();
      } catch (error) {
        setError('Erro ao excluir atendimento');
        console.error('Erro ao excluir atendimento:', error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
    setSearchError('');
  };

  const openCreateDialog = () => {
    setEditingQuestionnaire(null);
    setFormData({ nome: '', cpf: '', rg: '', endereco: '', telefone: '', relato: '', medidas_protetivas: '', observacoes: '' });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Atendimento às Vítimas
                </h1>
                <p className="text-gray-600">
                  Registrar e acompanhar atendimentos - Lei Maria da Penha
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Atendimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestionnaire ? 'Editar Atendimento' : 'Novo Atendimento'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingQuestionnaire 
                      ? 'Edite as informações do atendimento abaixo.'
                      : 'Preencha as informações para registrar um novo atendimento.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da Vítima *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="nome"
                          name="nome"
                          type="text"
                          placeholder="Nome completo"
                          value={formData.nome}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <Input
                        id="rg"
                        name="rg"
                        type="text"
                        placeholder="00.000.000-0"
                        value={formData.rg}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="text"
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      type="text"
                      placeholder="Endereço completo"
                      value={formData.endereco}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="relato">Relato da Ocorrência</Label>
                    <Textarea
                      id="relato"
                      name="relato"
                      placeholder="Descreva detalhadamente a ocorrência relatada pela vítima"
                      value={formData.relato}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medidas_protetivas">Medidas Protetivas</Label>
                    <Textarea
                      id="medidas_protetivas"
                      name="medidas_protetivas"
                      placeholder="Medidas protetivas solicitadas ou aplicadas"
                      value={formData.medidas_protetivas}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      name="observacoes"
                      placeholder="Observações adicionais sobre o atendimento"
                      value={formData.observacoes}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingQuestionnaire ? 'Atualizar' : 'Registrar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Busca */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Atendimento
              </CardTitle>
              <CardDescription>
                Busque um atendimento existente por CPF ou RG da vítima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                {searchError && (
                  <Alert variant="destructive">
                    <AlertDescription>{searchError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-cpf">CPF</Label>
                    <Input
                      id="search-cpf"
                      name="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={searchData.cpf}
                      onChange={handleSearchChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="search-rg">RG</Label>
                    <Input
                      id="search-rg"
                      name="rg"
                      type="text"
                      placeholder="00.000.000-0"
                      value={searchData.rg}
                      onChange={handleSearchChange}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      type="submit" 
                      disabled={searchLoading}
                      className="w-full"
                    >
                      {searchLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
              
              {searchResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Atendimento Encontrado:</h4>
                  <p><strong>Nome:</strong> {searchResult.nome}</p>
                  <p><strong>CPF:</strong> {searchResult.cpf}</p>
                  <p><strong>RG:</strong> {searchResult.rg}</p>
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleEdit(searchResult)}
                    >
                      Editar Atendimento
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Atendimentos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Atendimentos</CardTitle>
              <CardDescription>
                Todos os atendimentos registrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Carregando atendimentos...</span>
                </div>
              ) : questionnaires.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum atendimento encontrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionnaires.map((questionnaire) => (
                      <TableRow key={questionnaire.id}>
                        <TableCell className="font-medium">{questionnaire.nome}</TableCell>
                        <TableCell>{questionnaire.cpf}</TableCell>
                        <TableCell>{questionnaire.telefone || '-'}</TableCell>
                        <TableCell>
                          {questionnaire.createdAt 
                            ? new Date(questionnaire.createdAt).toLocaleDateString('pt-BR')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(questionnaire)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(questionnaire.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VictimQuestionnaires;

