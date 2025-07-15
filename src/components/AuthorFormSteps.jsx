// src/components/AuthorFormSteps.jsx – versão completa com correção do loop
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  User,
  MapPin,
  FileText,
  Shield,
  Clock,
  ChevronRight,
} from 'lucide-react';
import apiService from '../services/api';

// -----------------------------------------------------------------------------
// HOOK UTILITÁRIO – evita loop atualizando **apenas** se o objeto realmente muda
// -----------------------------------------------------------------------------
function shallowEqual(objA, objB) {
  if (objA === objB) return true;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => objA[k] === objB[k]);
}

function useStepData(dataProp, onChange) {
  const [localData, setLocalData] = useState(dataProp || {});

  useEffect(() => {
    if (!shallowEqual(localData, dataProp)) {
      setLocalData(dataProp || {});
    }
  }, [dataProp]);

  const patch = (patchObj) => {
    setLocalData((prev) => {
      const next = { ...prev, ...patchObj };
      if (!shallowEqual(prev, next)) {
        onChange?.(next);
      }
      return next;
    });
  };

  return [localData, patch];
}

/* -------------------------------------------------------------------------- */
/* PASSO 1 – Informações da Visita e Processo  (ID: "visit_process_info")      */
/* -------------------------------------------------------------------------- */
export const AuthorVisitInfoStep = ({ data = {}, onChange }) => {
  const merged = useMemo(
    () => ({
      authorPresence: '',
      otherAuthorPresence: '',
      attendanceType: '',
      otherAttendanceType: '',
      visitingUnit: '',
      varaFamily: '',
      numberProcess: '',
      visitDate: '',
      visitTime: '',
      ...data,
    }),
    [data]
  );
  const [formData, update] = useStepData(merged, onChange);

  const handle = {
    change: (e) => update({ [e.target.name]: e.target.value }),
    select: (k, v) => update({ [k]: v }),
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Informações da Visita e Processo</h3>
      {/* Presença do autor */}
      <div className="space-y-2">
        <Label>Presença do Autor *</Label>
        <Select value={formData.authorPresence} onValueChange={(v) => handle.select('authorPresence', v)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['PRESENTE', 'AUSENTE', 'ENDEREÇO NÃO LOCALIZADO', 'MUDANÇA DE ENDEREÇO', 'Outro'].map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {formData.authorPresence === 'Outro' && (
        <Input
          placeholder="Especifique o tipo de presença"
          name="otherAuthorPresence"
          value={formData.otherAuthorPresence || ''}
          onChange={handle.change}
          className="bg-gray-700 border-gray-600 text-white"
        />
      )}
      {/* Tipo de atendimento */}
      <div className="space-y-2">
        <Label>Tipo de Atendimento *</Label>
        <Select value={formData.attendanceType} onValueChange={(v) => handle.select('attendanceType', v)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {[
              'PRESENCIAL NA RESIDÊNCIA',
              'PRESENCIAL NO LOCAL DE TRABALHO',
              'PRESENCIAL EM LOCAL NEUTRO',
              'POR TELEFONE',
              'ATENDIMENTO NÃO REALIZADO EM VIRTUDE DE NÃO LOCALIZAÇÃO DO AUTOR',
              'Outro',
            ].map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {formData.attendanceType === 'Outro' && (
        <Input
          placeholder="Especifique o tipo de atendimento"
          name="otherAttendanceType"
          value={formData.otherAttendanceType || ''}
          onChange={handle.change}
          className="bg-gray-700 border-gray-600 text-white"
        />
      )}
      {/* Unidade */}
      <div className="space-y-2">
        <Label>Unidade que realizou a visita *</Label>
        <Select value={formData.visitingUnit} onValueChange={(v) => handle.select('visitingUnit', v)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['GUARDA MUNICIPAL DE ANANINDEUA', '6º BPM', '29º BPM', '30º BPM', 'Outro'].map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Vara / processo e data/hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vara Familiar *</Label>
          <Select value={formData.varaFamily} onValueChange={(v) => handle.select('varaFamily', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="4ª VVDF - ANANINDEUA">4ª VVDF - Ananindeua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          name="numberProcess"
          placeholder="Número do processo *"
          value={formData.numberProcess}
          onChange={handle.change}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="date" name="visitDate" value={formData.visitDate} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
        <Input type="time" name="visitTime" value={formData.visitTime} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PASSO 2 – Dados Pessoais  (ID: "personal_data")                             */
/* -------------------------------------------------------------------------- */
export const AuthorPersonalDataStep = ({ data = {}, onChange }) => {
  const merged = useMemo(
    () => ({
      authorEmployed: false,
      ...data,
    }),
    [data]
  );
  const [formData, update] = useStepData(merged, onChange);

  const handle = {
    change: (e) => {
      const { name, value, type, checked } = e.target;
      update({ [name]: type === 'checkbox' ? checked : value });
    },
    select: (k, v) => update({ [k]: v }),
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Dados Pessoais do Autor</h3>
      {/* Nome e vítima */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome do Autor *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              name="authorName"
              value={formData.authorName || ''}
              onChange={handle.change}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Nome da Vítima *</Label>
          <Input name="victimName" value={formData.victimName || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
        </div>
      </div>
      {/* Datas e documentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input type="date" name="authorBirthDate" value={formData.authorBirthDate || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
        <Input name="authorRG" placeholder="RG *" value={formData.authorRG || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
        <Input name="authorCPF" placeholder="CPF *" value={formData.authorCPF || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
      </div>
      {/* Sexo & etnia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sexo *</Label>
          <Select value={formData.authorGender || ''} onValueChange={(v) => handle.select('authorGender', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="FEMININO">Feminino</SelectItem>
              <SelectItem value="MASCULINO">Masculino</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Etnia/Cor *</Label>
          <Select value={formData.authorEthnicity || ''} onValueChange={(v) => handle.select('authorEthnicity', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['BRANCA', 'NEGRA', 'PARDA', 'ORIENTAL', 'INDÍGENA'].map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Escolaridade */}
      <div className="space-y-2">
        <Label>Grau de Escolaridade *</Label>
        <Select value={formData.authorEducationLevel || ''} onValueChange={(v) => handle.select('authorEducationLevel', v)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {[
              'ENSINO FUNDAMENTAL INCOMPLETO',
              'ENSINO FUNDAMENTAL COMPLETO',
              'ENSINO MÉDIO INCOMPLETO',
              'ENSINO MÉDIO COMPLETO',
              'ENSINO SUPERIOR INCOMPLETO',
              'ENSINO SUPERIOR COMPLETO',
            ].map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Estado civil + trabalha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estado Civil *</Label>
          <Select value={formData.authorMaritalStatus || ''} onValueChange={(v) => handle.select('authorMaritalStatus', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['CASADO(A)', 'UNIÃO ESTÁVEL', 'SOLTEIRO(A)', 'DIVORCIADO(A)', 'VIÚVO(A)', 'Outro'].map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 mt-8">
          <Checkbox checked={!!formData.authorEmployed} onCheckedChange={(c) => handle.select('authorEmployed', c)} className="border-gray-600" />
          <Label>O autor trabalha?</Label>
        </div>
      </div>
      {/* Renda */}
      <div className="space-y-2">
        <Label>Renda Familiar *</Label>
        <Select value={formData.authorIncome || ''} onValueChange={(v) => handle.select('authorIncome', v)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['UM SALÁRIO', 'MENOS DE UM SALÁRIO', 'MAIS DE UM SALÁRIO', 'NÃO DECLAROU'].map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PASSO 3 – Endereço e Relacionamento  (ID: "address_relationship")           */
/* -------------------------------------------------------------------------- */
export const AuthorAddressRelationshipStep = ({ data = {}, onChange }) => {
  const merged = useMemo(
    () => ({
      authorMunicipality: '',
      hasChildrenWithVictim: false,
      residesNearVictim: false,
      authorOrFamilyNearVictim: false,
      ...data,
    }),
    [data]
  );
  const [formData, update] = useStepData(merged, onChange);

  const handle = {
    change: (e) => {
      const { name, value, type, checked } = e.target;
      update({ [name]: type === 'checkbox' ? checked : value });
    },
    select: (k, v) => update({ [k]: v }),
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Endereço & Relacionamento</h3>
      <Input name="authorAddress" placeholder="Endereço *" value={formData.authorAddress || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="authorNeighborhood" placeholder="Bairro *" value={formData.authorNeighborhood || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
        <div className="space-y-2">
          <Label>Município *</Label>
          <Select value={formData.authorMunicipality || ''} onValueChange={(v) => handle.select('authorMunicipality', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['BELÉM', 'ANANINDEUA', 'Outro'].map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {formData.authorMunicipality === 'Outro' && (
        <Input name="otherMunicipality" placeholder="Especifique o município" value={formData.otherMunicipality || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
      )}
      <div className="space-y-2">
        <Label>Grau de Parentesco com a Vítima *</Label>
        <Select value={formData.relationshipWithVictim || ''} onValueChange={(v) => handle.select('relationshipWithVictim', v)}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['ESPOSA', 'EX CÔNJUGE', 'NAMORADA', 'FILHA', 'IRMÃ', 'MADRASTA', 'MÃE', 'EX NAMORADA', 'Outro'].map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* filhos */}
      <div className="flex items-center space-x-2">
        <Checkbox checked={!!formData.hasChildrenWithVictim} onCheckedChange={(c) => handle.select('hasChildrenWithVictim', c)} className="border-gray-600" />
        <Label>Possui filhos com a vítima?</Label>
      </div>
      {formData.hasChildrenWithVictim && (
        <Input type="number" name="numberOfChildrenWithVictim" placeholder="Quantos filhos?" value={formData.numberOfChildrenWithVictim || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
      )}
      {/* proximidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox checked={!!formData.residesNearVictim} onCheckedChange={(c) => handle.select('residesNearVictim', c)} className="border-gray-600" />
          <Label>Reside próximo da vítima?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox checked={!!formData.authorOrFamilyNearVictim} onCheckedChange={(c) => handle.select('authorOrFamilyNearVictim', c)} className="border-gray-600" />
          <Label>Autor ou familiares próximos da vítima?</Label>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PASSO 4 – Substâncias & Comportamento  (ID: "substance_behavior")            */
/* -------------------------------------------------------------------------- */
export const AuthorSubstanceBehaviorStep = ({ data = {}, onChange }) => {
  const merged = useMemo(
    () => ({
      substanceUse: false,
      alcoholUse: false,
      drugUse: false,
      chemicalDependencyTreatment: false,
      mentalDisorders: false,
      hasCriminalRecord: false,
      hasBeenArrested: false,
      ...data,
    }),
    [data]
  );
  const [formData, update] = useStepData(merged, onChange);

  const handle = {
    change: (e) => {
      const { name, value, type, checked } = e.target;
      update({ [name]: type === 'checkbox' ? checked : value });
    },
    select: (k, v) => update({ [k]: v }),
  };

  // helpers para blocos condicionais
  const freqOpts = ['DIARIAMENTE', 'SEMANALMENTE', 'MENSALMENTE', 'OCASIONALMENTE', 'NÃO USA'];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Substâncias & Comportamento</h3>
      {/* álcool/drogas */}
      <div className="flex items-center space-x-2">
        <Checkbox checked={!!formData.substanceUse} onCheckedChange={(c) => handle.select('substanceUse', c)} className="border-gray-600" />
        <Label>Consome álcool/drogas?</Label>
      </div>
      {formData.substanceUse && (
        <Input name="substanceDetails" placeholder="Qual substância?" value={formData.substanceDetails || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
      )}
      {/* álcool específico */}
      <div className="flex items-center space-x-2">
        <Checkbox checked={!!formData.alcoholUse} onCheckedChange={(c) => handle.select('alcoholUse', c)} className="border-gray-600" />
        <Label>Já fez/ faz uso de álcool?</Label>
      </div>
      {formData.alcoholUse && (
        <div className="space-y-2">
          <Label>Frequência *</Label>
          <Select value={formData.alcoholUseFrequency || ''} onValueChange={(v) => handle.select('alcoholUseFrequency', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {freqOpts.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {/* drogas */}
      <div className="flex items-center space-x-2">
        <Checkbox checked={!!formData.drugUse} onCheckedChange={(c) => handle.select('drugUse', c)} className="border-gray-600" />
        <Label>Uso de drogas?</Label>
      </div>
      {formData.drugUse && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="drugDetails" placeholder="Tipo de droga" value={formData.drugDetails || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
          <Select value={formData.drugUseFrequency || ''} onValueChange={(v) => handle.select('drugUseFrequency', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Frequência" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {freqOpts.slice(0, 4).map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {/* flags adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['chemicalDependencyTreatment', 'Tratamento para dependência química?'],
          ['mentalDisorders', 'Transtornos mentais?'],
          ['hasCriminalRecord', 'Antecedentes criminais?'],
          ['hasBeenArrested', 'Já foi preso?'],
        ].map(([field, label]) => (
          <div key={field} className="flex items-center space-x-2">
            <Checkbox checked={!!formData[field]} onCheckedChange={(c) => handle.select(field, c)} className="border-gray-600" />
            <Label>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PASSO 5 – Medidas Protetivas  (ID: "protective_measures")                   */
/* -------------------------------------------------------------------------- */
export const AuthorProtectiveMeasuresStep = ({ data = {}, onChange }) => {
  const merged = useMemo(
    () => ({
      protectiveMeasuresComplied: false,
      notifiedAboutProtectiveMeasures: false,
      complyingWithProtectiveMeasures: false,
      agreesWithQuestionnaire: false,
      ...data,
    }),
    [data]
  );
  const [formData, update] = useStepData(merged, onChange);

  const handle = {
    change: (e) => {
      const { name, value, type, checked } = e.target;
      update({ [name]: type === 'checkbox' ? checked : value });
    },
    select: (k, v) => update({ [k]: v }),
  };

  const freqOpts = ['DIARIAMENTE', 'SEMANALMENTE', 'MENSALMENTE', 'OCASIONALMENTE'];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Medidas Protetivas & Contato</h3>
      {/* cumprimento */}
      <div className="flex items-center space-x-2">
        <Checkbox checked={!!formData.protectiveMeasuresComplied} onCheckedChange={(c) => handle.select('protectiveMeasuresComplied', c)} className="border-gray-600" />
        <Label>Medidas protetivas estão sendo cumpridas?</Label>
      </div>
      {!formData.protectiveMeasuresComplied && (
        <Textarea name="nonComplianceDetails" placeholder="Como estão sendo descumpridas?" value={formData.nonComplianceDetails || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" rows={3} />
      )}
      {/* datas de contato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="date" name="lastContactDate" value={formData.lastContactDate || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
        <div className="space-y-2">
          <Label>Frequência do contato *</Label>
          <Select value={formData.contactFrequency || ''} onValueChange={(v) => handle.select('contactFrequency', v)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {freqOpts.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Input type="date" name="lastContactWithVictimDate" value={formData.lastContactWithVictimDate || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" />
      {/* notificações */}
      <div className="flex items-center space-x-2">
        <Checkbox checked={!!formData.notifiedAboutProtectiveMeasures} onCheckedChange={(c) => handle.select('notifiedAboutProtectiveMeasures', c)} className="border-gray-600" />
        <Label>Autor foi notificado sobre as medidas protetivas?</Label>
      </div>
      {formData.notifiedAboutProtectiveMeasures && (
        <div className="flex items-center space-x-2">
          <Checkbox checked={!!formData.complyingWithProtectiveMeasures} onCheckedChange={(c) => handle.select('complyingWithProtectiveMeasures', c)} className="border-gray-600" />
          <Label>Cumpre inteiramente as medidas?</Label>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Checkbox checked={!!formData.agreesWithQuestionnaire} onCheckedChange={(c) => handle.select('agreesWithQuestionnaire', c)} className="border-gray-600" />
        <Label>Concorda com o teor do questionário?</Label>
      </div>
      <Textarea name="generalObservations" placeholder="Observações gerais" value={formData.generalObservations || ''} onChange={handle.change} className="bg-gray-700 border-gray-600 text-white" rows={4} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ARRAY DE PASSOS                                                            */
/* -------------------------------------------------------------------------- */
export const AuthorFormSteps = [
  { id: 'visit_process_info',  title: 'Informações da Visita',        icon: Clock,  component: React.memo(AuthorVisitInfoStep) },
  { id: 'personal_data',       title: 'Dados Pessoais',              icon: User,   component: React.memo(AuthorPersonalDataStep) },
  { id: 'address_relationship',title: 'Endereço & Relacionamento',   icon: MapPin, component: React.memo(AuthorAddressRelationshipStep) },
  { id: 'substance_behavior',  title: 'Substâncias & Comportamento', icon: Shield, component: React.memo(AuthorSubstanceBehaviorStep) },
  { id: 'protective_measures', title: 'Medidas Protetivas',          icon: FileText, component: React.memo(AuthorProtectiveMeasuresStep) },
];

/* -------------------------------------------------------------------------- */
/* HELPER – salvar questionário                                               */
/* -------------------------------------------------------------------------- */
export async function saveAuthorQuestionnaire(data, id = null) {
  return id ? apiService.updateAuthorQuestionnaire(id, data) : apiService.createAuthorQuestionnaire(data);
}

export default AuthorFormSteps;
