import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit, Printer, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import Layout from '../components/Layout';
import MultiStepForm from '../components/MultiStepForm';
import { VictimFormSteps } from '../components/VictimFormSteps';

/* -------------------------------------------------------------------------- */
/* Página: Lista & cadastro de vítimas                                        */
/* -------------------------------------------------------------------------- */
const Victims = () => {
  const { hasPermission, PERMISSIONS } = useAuth();
  const [victims, setVictims]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [currentPage, setCurrentPage]       = useState(1);
  const [showForm, setShowForm]             = useState(false);
  const [editingVictim, setEditingVictim]   = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);   
  const [deleting, setDeleting]             = useState(false);
  const itemsPerPage = 6;

  /* ------------------------------------------------------------------ */
  /* Carrega lista                                                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => { fetchVictims(); }, []);

  const fetchVictims = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVictimQuestionnaires();
      setVictims(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar vítimas:', err);
      setVictims([]);
    } finally { setLoading(false); }
  };

  /* ------------------------------------------------------------------ */
  /* Busca                                                               */
  /* ------------------------------------------------------------------ */
  const handleSearch = async () => {
    if (!searchTerm.trim()) { fetchVictims(); return; }
    try {
      setLoading(true);
      const data = await apiService.searchVictimByCpfOrRg(searchTerm);
      setVictims(data ? [data] : []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Erro ao buscar vítima:', err);
      setVictims([]);
    } finally { setLoading(false); }
  };
  const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();

  /* ------------------------------------------------------------------ */
  /* CRUD helpers                                                        */
  /* ------------------------------------------------------------------ */
  const handleAddVictim   = () => { setEditingVictim(null); setShowForm(true); };
  const handleEditVictim  = (v) => { setEditingVictim(v);   setShowForm(true); };

  // Abre modal de confirmação
  const askDeleteVictim   = (v) => setDeleteTarget(v);

  // Confirma exclusão
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await apiService.deleteVictimQuestionnaire(deleteTarget._id);
      toast.success('Vítima excluída com sucesso!', { theme: 'dark' });
      setDeleteTarget(null);
      fetchVictims();
    } catch (err) {
      console.error('Erro ao excluir vítima:', err);
      toast.error('Erro ao excluir vítima. Tente novamente.', { theme: 'dark' });
    } finally { setDeleting(false); }
  };

  const handlePrintVictim = (victim) => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Relatório - ${victim.victimName}</title><style>body{font-family:Arial;margin:20px}.header{text-align:center;margin-bottom:30px;border-bottom:2px solid #333;padding-bottom:10px}.section{margin-bottom:20px}.label{font-weight:bold}.value{margin-left:10px}</style></head><body>`);
    w.document.write(`<div class="header"><h1>GUARDA MUNICIPAL DE ANANINDEUA</h1><h2>PATRULHA MARIA DA PENHA</h2><h3>Relatório de Atendimento à Vítima</h3></div>`);
    w.document.write(`<div class="section"><h3>Dados Pessoais</h3><p><span class="label">Nome:</span><span class="value">${victim.victimName || '-'}</span></p><p><span class="label">CPF:</span><span class="value">${victim.cpf || '-'}</span></p><p><span class="label">RG:</span><span class="value">${victim.rg || '-'}</span></p><p><span class="label">Data de Nascimento:</span><span class="value">${formatDate(victim.birthDate)}</span></p></div>`);
    w.document.write(`<div class="section"><h3>Informações do Atendimento</h3><p><span class="label">Data do Registro:</span><span class="value">${new Date(victim.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span></p></div>`);
    w.document.write(`<div class="section" style="margin-top:50px;text-align:center;font-size:12px"><p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p></div>`);
    w.document.write('</body></html>');
    w.document.close();
    w.print();
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingVictim) await apiService.updateVictimQuestionnaire(editingVictim._id, data || {});
      else                await apiService.createVictimQuestionnaire(data);
      setShowForm(false);
      setEditingVictim(null);
      fetchVictims();
      toast.success('Vítima salva com sucesso!', { theme: 'dark' });
    } catch (err) {
      console.error('Erro ao salvar vítima:', err);
      toast.error('Erro ao salvar. Tente novamente.', { theme: 'dark' });
      throw err;
    }
  };

  /* ------------------------------------------------------------------ */
  /* Helpers UI                                                         */
  /* ------------------------------------------------------------------ */
  const filtered = victims.filter(v =>
    v.victimName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.cpf?.includes(searchTerm) ||
    v.rg?.includes(searchTerm)
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const sliceFrom  = (currentPage - 1) * itemsPerPage;
  const current    = filtered.slice(sliceFrom, sliceFrom + itemsPerPage);
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '-');

  /* ------------------------------------------------------------------ */
  /* Formulário em modo "overlay"                                       */
  /* ------------------------------------------------------------------ */
  if (showForm) {
    return (
      <Layout>
        <MultiStepForm
          title={editingVictim ? 'Editar Vítima' : 'Cadastrar Nova Vítima'}
          steps={VictimFormSteps}
          initialData={editingVictim || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingVictim(null); }}
        />
      </Layout>
    );
  }

  /* ------------------------------------------------------------------ */
  /* LISTAGEM                                                           */
  /* ------------------------------------------------------------------ */
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white mb-2">PRIMEIRO ATENDIMENTO À VÍTIMA</h1>

        {/* Busca */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Digite CPF, RG ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" /> Pesquisar
              </Button>
              <Button onClick={handleAddVictim} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Carregando...</div>
        ) : current.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-8 text-center text-gray-400">Nenhuma vítima encontrada.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {current.map((v) => (
              <Card key={v._id} className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle className="text-lg text-white">{v.victimName}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-400">
                  <p><strong className="text-white">CPF:</strong> {v.cpf || '-'}</p>
                  <p><strong className="text-white">RG:</strong> {v.rg || '-'}</p>
                  <p><strong className="text-white">Nascimento:</strong> {formatDate(v.birthDate)}</p>
                  <p><strong className="text-white">Relacionamento:</strong> {v.relationshipWithAuthor || '-'}</p>
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" className="flex-1 bg-yellow-600 hover:bg-yellow-700" onClick={() => handleEditVictim(v)}>
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handlePrintVictim(v)}>
                      <Printer className="h-4 w-4 mr-1" /> Imprimir
                    </Button>
                    <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => askDeleteVictim(v)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">Anterior</Button>
            <span className="text-gray-400">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">Próxima</Button>
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}>
        <DialogContent className="max-w-md bg-gray-800 border-gray-700">
          <DialogHeader><DialogTitle>Excluir atendimento</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-300">Tem certeza que deseja excluir <span className="font-semibold text-white">{deleteTarget?.victimName || 'esta vítima'}</span>?</p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" disabled={deleting} onClick={() => setDeleteTarget(null)} className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">Cancelar</Button>
            <Button disabled={deleting} onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">{deleting ? 'Excluindo...' : 'Excluir'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Victims;
