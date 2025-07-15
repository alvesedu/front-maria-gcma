// src/pages/Authors.jsx – versão com modal de confirmação de exclusão
// -----------------------------------------------------------------------------
// * Substitui window.confirm/alert por <Dialog> + react‑toastify
// * Usa estados deleteTarget/isDeleting para controlar o fluxo
// * Dispara toast de sucesso/erro após tentar excluir
// * Mantém toda a lógica anterior de listagem, busca, paginação e formulário
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

// UI primitives
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Icons
import { Search, Plus, Edit, Printer, Trash2 } from 'lucide-react';

// Serviços / componentes internos
import apiService from '../services/api';
import Layout from '../components/Layout';
import MultiStepForm from '../components/MultiStepForm';
import { AuthorFormSteps } from '../components/AuthorFormSteps';

const Authors = () => {
  const { hasPermission, PERMISSIONS } = useAuth();

  // ------------------------ state ------------------------
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  // exclusão
  const [deleteTarget, setDeleteTarget] = useState(null); // objeto author ou null
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 6;

  // ------------------------ fetch ------------------------
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAuthorQuestionnaires();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar autores:', err);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------ busca ------------------------
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchAuthors();
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.searchAuthorByCpfOrRg(searchTerm);
      setAuthors(data ? [data] : []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Erro ao buscar autor:', err);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();

  // ------------------------ CRUD helpers ------------------------
  const handleAddAuthor = () => {
    setEditingAuthor(null);
    setShowForm(true);
  };

  const handleEditAuthor = (author) => {
    setEditingAuthor(author);
    setShowForm(true);
  };

  // Abre modal de confirmação
  const askDeleteAuthor = (author) => setDeleteTarget(author);

  // Cancela modal
  const handleCancelDelete = () => setDeleteTarget(null);

  // Confirma e deleta
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiService.deleteAuthorQuestionnaire(deleteTarget._id);
      toast.success('Autor excluído com sucesso!', { theme: 'dark' });
      setDeleteTarget(null);
      fetchAuthors();
    } catch (err) {
      console.error('Erro ao excluir autor:', err);
      toast.error('Erro ao excluir autor. Tente novamente.', { theme: 'dark' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintAuthor = (author) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!doctype html><html><head><title>Relatório de Autor - ${author.authorName}</title><style>body{font-family:Arial,sans-serif;margin:20px}.header{text-align:center;margin-bottom:30px;border-bottom:2px solid #333;padding-bottom:10px}.section{margin-bottom:20px}.label{font-weight:bold}.value{margin-left:10px}</style></head><body><div class="header"><h1>GUARDA MUNICIPAL DE ANANINDEUA</h1><h2>PATRULHA MARIA DA PENHA</h2><h3>Relatório de Registro do Autor</h3></div><div class="section"><h3>Dados Pessoais</h3><p><span class="label">Nome:</span><span class="value">${author.authorName || '-'}</span></p><p><span class="label">CPF:</span><span class="value">${author.authorCPF || '-'}</span></p><p><span class="label">RG:</span><span class="value">${author.authorRG || '-'}</span></p><p><span class="label">Data de Nascimento:</span><span class="value">${formatDate(author.authorBirthDate)}</span></p></div><div class="section"><h3>Informações do Registro</h3><p><span class="label">Data do Registro:</span><span class="value">${new Date(author.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span></p></div><div class="section" style="margin-top:50px;text-align:center;font-size:12px"><p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p></div></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingAuthor) {
        await apiService.updateAuthorQuestionnaire(editingAuthor._id, formData);
      } else {
        await apiService.createAuthorQuestionnaire(formData);
      }
      setShowForm(false);
      setEditingAuthor(null);
      fetchAuthors();
    } catch (err) {
      console.error('Erro ao salvar autor:', err);
      toast.error('Erro ao salvar autor. Tente novamente.', { theme: 'dark' });
      throw err;
    }
  };

  // ------------------------ filtragem e paginação ------------------------
  const filteredAuthors = authors.filter((a) =>
    a.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.authorCPF?.includes(searchTerm) ||
    a.authorRG?.includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentAuthors = filteredAuthors.slice(start, start + itemsPerPage);

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString('pt-BR') : '-');

  // ------------------------ render ------------------------
  if (showForm) {
    return (
      <Layout>
        <MultiStepForm
          title={editingAuthor ? 'Editar Autor' : 'Cadastrar Novo Autor'}
          steps={AuthorFormSteps}
          initialData={editingAuthor || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAuthor(null);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-white">PRIMEIRO ATENDIMENTO AO AUTOR</h1>

        {/* Search */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Digite sua pesquisa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" /> Pesquisar
              </Button>
              <Button onClick={handleAddAuthor} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Listagem */}
        {loading ? (
          <p className="text-center text-gray-400 py-8">Carregando autores...</p>
        ) : currentAuthors.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-8 text-center text-gray-400">Nenhum autor encontrado.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAuthors.map((author) => (
              <Card key={author._id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Informações do Autor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div><p className="text-sm text-gray-400">Nome:</p><p className="text-white font-medium">{author.authorName || '-'}</p></div>
                  <div><p className="text-sm text-gray-400">Nome da Vítima:</p><p className="text-white">{author.victimName || '-'}</p></div>
                  <div><p className="text-sm text-gray-400">RG:</p><p className="text-white">{author.authorRG || '-'}</p></div>
                  <div><p className="text-sm text-gray-400">CPF:</p><p className="text-white">{author.authorCPF || '-'}</p></div>
                  <div><p className="text-sm text-gray-400">Nascimento:</p><p className="text-white">{formatDate(author.authorBirthDate)}</p></div>
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 flex-1" onClick={() => handleEditAuthor(author)}>
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1" onClick={() => handlePrintAuthor(author)}>
                      <Printer className="h-4 w-4 mr-1" /> Imprimir
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 flex-1" onClick={() => askDeleteAuthor(author)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">Anterior</Button>
            <span className="text-gray-400">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">Próxima</Button>
          </div>
        )}
      </div>

      {/* Dialog de confirmação */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && handleCancelDelete()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">Tem certeza de que deseja excluir <strong>{deleteTarget?.authorName}</strong>? Esta ação não poderá ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelDelete} disabled={isDeleting}>Cancelar</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Authors;
