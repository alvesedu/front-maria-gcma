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
import { ArrowLeft, Plus, Edit, Trash2, Loader2, FileText } from 'lucide-react';

const AuthorQuestionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAuthorQuestionnaires();
      setQuestionnaires(response);
    } catch (error) {
      setError('Erro ao carregar questionários');
      console.error('Erro ao buscar questionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError('Título e descrição são obrigatórios');
      return;
    }

    try {
      if (editingQuestionnaire) {
        await apiService.updateAuthorQuestionnaire(editingQuestionnaire.id, formData);
      } else {
        await apiService.createAuthorQuestionnaire(formData);
      }
      
      setIsDialogOpen(false);
      setEditingQuestionnaire(null);
      setFormData({ title: '', description: '', questions: '' });
      setError('');
      fetchQuestionnaires();
    } catch (error) {
      setError('Erro ao salvar questionário');
      console.error('Erro ao salvar questionário:', error);
    }
  };

  const handleEdit = (questionnaire) => {
    setEditingQuestionnaire(questionnaire);
    setFormData({
      title: questionnaire.title || '',
      description: questionnaire.description || '',
      questions: questionnaire.questions || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (questionnaireId) => {
    if (window.confirm('Tem certeza que deseja excluir este questionário?')) {
      try {
        await apiService.deleteAuthorQuestionnaire(questionnaireId);
        fetchQuestionnaires();
      } catch (error) {
        setError('Erro ao excluir questionário');
        console.error('Erro ao excluir questionário:', error);
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

  const openCreateDialog = () => {
    setEditingQuestionnaire(null);
    setFormData({ title: '', description: '', questions: '' });
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
                  Questionários de Autor
                </h1>
                <p className="text-gray-600">
                  Gerencie questionários criados por autores
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Questionário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestionnaire ? 'Editar Questionário' : 'Novo Questionário'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingQuestionnaire 
                      ? 'Edite as informações do questionário abaixo.'
                      : 'Preencha as informações para criar um novo questionário.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Título do questionário"
                        value={formData.title}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descrição do questionário"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="questions">Perguntas</Label>
                    <Textarea
                      id="questions"
                      name="questions"
                      placeholder="Digite as perguntas do questionário (uma por linha ou em formato JSON)"
                      value={formData.questions}
                      onChange={handleChange}
                      rows={6}
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
                      {editingQuestionnaire ? 'Atualizar' : 'Criar'}
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
          <Card>
            <CardHeader>
              <CardTitle>Lista de Questionários de Autor</CardTitle>
              <CardDescription>
                Todos os questionários criados por autores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Carregando questionários...</span>
                </div>
              ) : questionnaires.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum questionário encontrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionnaires.map((questionnaire) => (
                      <TableRow key={questionnaire.id}>
                        <TableCell>{questionnaire.id}</TableCell>
                        <TableCell className="font-medium">{questionnaire.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{questionnaire.description}</TableCell>
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

export default AuthorQuestionnaires;

