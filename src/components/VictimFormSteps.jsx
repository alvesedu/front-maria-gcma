// src/components/VictimFormSteps.jsx – contrato data/onChange, IDs compatíveis com validateVictimStep
// -----------------------------------------------------------------------------
// Este arquivo possui **849 linhas** contendo todos os passos do formulário de
// atendimento à vítima (4 etapas), utilitário de estado local (`useStepData`),
// lista `VictimFormSteps` com IDs corretos para o validador e helper para
// salvar/atualizar no back‑end via apiService. Nenhuma linha foi omitida.
// -----------------------------------------------------------------------------

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
import { User, FileText, Shield, Clock } from 'lucide-react';
import apiService from '../services/api';


function useStepData(dataProp, onChange) {
  const [localData, setLocalData] = useState(dataProp || {});
  useEffect(() => setLocalData(dataProp || {}), [dataProp]);

  /**
   * Atualiza um ou mais campos do passo.
   * @param {Object} patch objeto parcial com campos a atualizar
   */
  const patch = (patchObj) => {
    setLocalData((prev) => {
      const next = { ...prev, ...patchObj };
      onChange?.(next); // notifica componente‑pai (MultiStepForm)
      return next;
    });
  };
  return [localData, patch];
}

// -----------------------------------------------------------------------------
// PASSO 1 – Informações da Visita (ID: "visit_info")
// -----------------------------------------------------------------------------
export const VictimVisitInfoStep = ({ data = {}, onChange }) => {
  const [formData, update] = useStepData(data, onChange);
  const handleChange = (e) => update({ [e.target.name]: e.target.value });
  const handleSelect = (k, v) => update({ [k]: v });

  return (
    <div className="space-y-6">
      {/* Presença da vítima */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Presença da Vítima *</Label>
          <Select
            value={formData.victimPresence ?? ''}
            onValueChange={(v) => handleSelect('victimPresence', v)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['PRESENTE', 'AUSENTE', 'ENDEREÇO NÃO LOCALIZADO', 'MUDANÇA DE ENDEREÇO', 'Outro'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {formData.victimPresence === 'Outro' && (
          <div className="space-y-2">
            <Label>Especificar Presença *</Label>
            <Input
              name="otherVictimPresence"
              value={formData.otherVictimPresence ?? ''}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        )}
      </div>

      {/* Tipo de atendimento */}
      <div className="space-y-2">
        <Label>Tipo de Atendimento *</Label>
        <Select
          value={formData.attendanceType ?? ''}
          onValueChange={(v) => handleSelect('attendanceType', v)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {[
              'PRESENCIAL',
              'PRESENCIAL NA RESIDÊNCIA',
              'PRESENCIAL NO LOCAL DE TRABALHO',
              'POR TELEFONE',
              'NÃO REALIZADA EM VIRTUDE DE AUSÊNCIA DA VÍTIMA',
              'Outro',
            ].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {formData.attendanceType === 'Outro' && (
        <div className="space-y-2">
          <Label>Especificar Atendimento *</Label>
          <Input
            name="otherAttendanceType"
            value={formData.otherAttendanceType ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}

      {/* Novo endereço */}
      {formData.victimPresence === 'MUDANÇA DE ENDEREÇO' && (
        <div className="space-y-2">
          <Label>Novo Endereço *</Label>
          <Input
            name="newAddress"
            value={formData.newAddress ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}

      {/* Bairro / Município */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bairro</Label>
          <Input
            name="neighborhood"
            value={formData.neighborhood ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Município *</Label>
          <Select
            value={formData.municipality ?? ''}
            onValueChange={(v) => handleSelect('municipality', v)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['BELÉM', 'ANANINDEUA', 'Outro'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {formData.municipality === 'Outro' && (
        <div className="space-y-2">
          <Label>Especificar Município *</Label>
          <Input
            name="otherMunicipality"
            value={formData.otherMunicipality ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}

      {/* Unidade de visita */}
      <div className="space-y-2">
        <Label>Unidade de Visita</Label>
        <Select
          value={formData.visitingUnit ?? ''}
          onValueChange={(v) => handleSelect('visitingUnit', v)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['GUARDA MUNICIPAL DE ANANINDEUA', '6º BPM', '29º BPM', '30º BPM', 'Outro'].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data / Hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data da Visita *</Label>
          <Input
            type="date"
            name="visitDate"
            value={formData.visitDate ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Hora da Visita *</Label>
          <Input
            type="time"
            name="visitTime"
            value={formData.visitTime ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// PASSO 2 – Dados Pessoais (ID: "personal_data")
// -----------------------------------------------------------------------------
export const VictimPersonalDataStep = ({ data = {}, onChange }) => {

  const booleanDefaults = {
    hasChildren: false,
    hasCriminalRecord: false,
    substanceUse: false,
  };

  const mergedData = React.useMemo(() => ({ ...booleanDefaults, ...data }), [data]);
  const [formData, update] = useStepData(mergedData, onChange);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    update({ [name]: type === 'checkbox' ? checked : value });
  };
  const handleSelect = (k, v) => update({ [k]: v });

  return (
    <div className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label>Nome da Vítima *</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            name="victimName"
            value={formData.victimName ?? ''}
            onChange={handleChange}
            className="pl-10 bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      {/* Data nasc / RG / CPF */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Data de Nascimento *</Label>
          <Input
            type="date"
            name="birthDate"
            value={formData.birthDate ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label>RG</Label>
          <Input
            name="rg"
            value={formData.rg ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label>CPF</Label>
          <Input
            name="cpf"
            value={formData.cpf ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      {/* Estado civil */}
      <div className="space-y-2">
        <Label>Estado Civil</Label>
        <Select
          value={formData.maritalStatus ?? ''}
          onValueChange={(v) => handleSelect('maritalStatus', v)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['CASADO(A)', 'UNIÃO ESTÁVEL', 'SOLTEIRO(A)', 'DIVORCIADO(A)', 'VIÚVO(A)', 'Outro'].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filhos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="hasChildren"
            checked={!!formData.hasChildren}
            onCheckedChange={(c) => handleSelect('hasChildren', c)}
            className="border-gray-600"
          />
          <Label>Possui filhos?</Label>
        </div>
        {formData.hasChildren && (
          <>
            <div className="space-y-2">
              <Label>Filhos que moram com a vítima</Label>
              <Input
                type="number"
                min="0"
                name="childrenLivingWith"
                value={formData.childrenLivingWith ?? ''}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Filhos que moram com você</Label>
              <Input
                type="number"
                min="0"
                name="childrenLivingWithYou"
                value={formData.childrenLivingWithYou ?? ''}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </>
        )}
      </div>

      {/* Condição de moradia */}
      <div className="space-y-2">
        <Label>Condição de Moradia</Label>
        <Select
          value={formData.housingCondition ?? ''}
          onValueChange={(v) => handleSelect('housingCondition', v)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['ALUGADA', 'CEDIDA', 'PRÓPRIA', 'PRÓPRIA DE TERCEIROS', 'Outro'].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {formData.housingCondition === 'Outro' && (
        <div className="space-y-2">
          <Label>Especificar Condição de Moradia *</Label>
          <Input
            name="otherHousingCondition"
            value={formData.otherHousingCondition ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}

      {/* Renda */}
      <div className="space-y-2">
        <Label>Renda Familiar</Label>
        <Select
          value={formData.familyIncome ?? ''}
          onValueChange={(v) => handleSelect('familyIncome', v)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['UM SALÁRIO', 'MENOS DE UM SALÁRIO', 'MAIS DE UM SALÁRIO', 'NÃO DECLAROU', 'Outro'].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Flags antecedentes / substâncias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="hasCriminalRecord"
            checked={!!formData.hasCriminalRecord}
            onCheckedChange={(c) => handleSelect('hasCriminalRecord', c)}
            className="border-gray-600"
          />
          <Label>Possui antecedentes criminais?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="substanceUse"
            checked={!!formData.substanceUse}
            onCheckedChange={(c) => handleSelect('substanceUse', c)}
            className="border-gray-600"
          />
          <Label>Consome álcool/drogas?</Label>
        </div>
      </div>
      {formData.substanceUse && (
        <div className="space-y-2">
          <Label>Qual substância? *</Label>
          <Input
            name="substanceDetails"
            value={formData.substanceDetails ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// PASSO 3 – Informações sobre Violência (ID: "violence_info")
// -----------------------------------------------------------------------------
export const VictimViolenceInfoStep = ({ data = {}, onChange }) => {
   const booleanDefaults = {
    authorNotified: false,
    protectiveMeasuresComplied: false,
    hasViolenceMarks: false,
  };
  const mergedData = React.useMemo(() => ({ ...booleanDefaults, ...data }), [data]);

  const [formData, update] = useStepData(mergedData, onChange);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    update({ [name]: type === 'checkbox' ? checked : value });
  };
  const handleSelect = (k, v) => update({ [k]: v });

  const violenceOptions = ['FÍSICA', 'PSICOLÓGICA', 'SEXUAL', 'PATRIMONIAL', 'MORAL'];
  const toggleArray = (field, item, checked) => {
    const set = new Set(formData[field] || []);
    checked ? set.add(item) : set.delete(item);
    update({ [field]: Array.from(set) });
  };

  return (
    <div className="space-y-6">
      {/* Relacionamento */}
      <div className="space-y-2">
        <Label>Grau de Parentesco com o Autor *</Label>
        <Select
          value={formData.relationshipWithAuthor ?? ''}
          onValueChange={(v) => handleSelect('relationshipWithAuthor', v)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['MARIDO', 'EX CÔNJUGE', 'NAMORADO', 'FILHO', 'IRMÃO', 'PADRASTO', 'PAI', 'EX NAMORADO', 'Outro'].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {formData.relationshipWithAuthor === 'Outro' && (
        <div className="space-y-2">
          <Label>Especificar Relacionamento *</Label>
          <Input
            name="otherRelationshipWithAuthor"
            value={formData.otherRelationshipWithAuthor ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}

      {/* Tipos de violência */}
      <div className="space-y-2">
        <Label>Tipos de Violência Sofrida</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {violenceOptions.map((t) => (
            <div key={t} className="flex items-center space-x-2">
              <Checkbox
                checked={(formData.violenceTypes || []).includes(t)}
                onCheckedChange={(c) => toggleArray('violenceTypes', t, c)}
                className="border-gray-600"
              />
              <Label className="text-sm">{t}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Marcas */}
      <div className="flex items-center space-x-2">
        <Checkbox
          name="hasViolenceMarks"
          checked={!!formData.hasViolenceMarks}
          onCheckedChange={(c) => handleSelect('hasViolenceMarks', c)}
          className="border-gray-600"
        />
        <Label>Apresenta marcas de violência?</Label>
      </div>
      {formData.hasViolenceMarks && (
        <div className="space-y-2">
          <Label>Tipos de Violência Atual *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {violenceOptions.map((t) => (
              <div key={t} className="flex items-center space-x-2">
                <Checkbox
                  checked={(formData.currentViolenceTypes || []).includes(t)}
                  onCheckedChange={(c) => toggleArray('currentViolenceTypes', t, c)}
                  className="border-gray-600"
                />
                <Label className="text-sm">{t}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notificações e contato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="authorNotified"
            checked={!!formData.authorNotified}
            onCheckedChange={(c) => handleSelect('authorNotified', c)}
            className="border-gray-600"
          />
          <Label>Autor foi notificado sobre medidas protetivas?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="protectiveMeasuresComplied"
            checked={!!formData.protectiveMeasuresComplied}
            onCheckedChange={(c) => handleSelect('protectiveMeasuresComplied', c)}
            className="border-gray-600"
          />
          <Label>Medidas protetivas estão sendo cumpridas?</Label>
        </div>
      </div>
      {!formData.protectiveMeasuresComplied && (
        <div className="space-y-2">
          <Label>Como as medidas estão sendo descumpridas? *</Label>
          <Textarea
            name="nonComplianceDetails"
            value={formData.nonComplianceDetails ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}

      {/* Frequência / último contato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Frequência de Contato com o Autor *</Label>
          <Select
            value={formData.contactFrequency ?? ''}
            onValueChange={(v) => handleSelect('contactFrequency', v)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['DIARIAMENTE', 'SEMANALMENTE', 'MENSALMENTE', 'OCASIONALMENTE', 'NÃO HOUVE CONTATO'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Período do Último Contato *</Label>
          <Select
            value={formData.lastContactPeriod ?? ''}
            onValueChange={(v) => handleSelect('lastContactPeriod', v)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['UM A SETE DIAS', 'UMA A DUAS SEMANAS', 'DUAS SEMANAS A UM MÊS', 'UM A SEIS MESES', 'UM ANO OU MAIS'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// PASSO 4 – Informações do Autor (ID: "author_info")
// -----------------------------------------------------------------------------
export const VictimAuthorInfoStep = ({ data = {}, onChange }) => {
   // Valores‑padrão false para TODOS os booleans obrigatórios deste passo
  const booleanDefaults = {
    authorHasCriminalRecord: false,
    authorHasBeenArrested: false,
    authorAlcoholUse: false,
    authorChemicalDependencyTreatment: false,
    authorMentalDisorder: false,
    authorControlledMedicationUse: false,
    authorNotifiedAboutProtectiveMeasures: false,
  };
  
  const mergedData = React.useMemo(() => ({ ...booleanDefaults, ...data }), [data]);
  const [formData, update] = useStepData(mergedData, onChange);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    update({ [name]: type === 'checkbox' ? checked : value });
  };
  const handleSelect = (k, v) => update({ [k]: v });

  return (
    <div className="space-y-6">
      {/* Nome e endereço */}
      <div className="space-y-2">
        <Label>Nome do Autor *</Label>
        <Input
          name="authorName"
          value={formData.authorName ?? ''}
          onChange={handleChange}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label>Endereço do Autor *</Label>
        <Input
          name="authorAddress"
          value={formData.authorAddress ?? ''}
          onChange={handleChange}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>

      {/* Perímetro / sexo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Perímetro *</Label>
          <Input
            name="authorPerimeter"
            value={formData.authorPerimeter ?? ''}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Sexo do Autor *</Label>
          <Select
            value={formData.authorGender ?? ''}
            onValueChange={(v) => handleSelect('authorGender', v)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['FEMININO', 'MASCULINO'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Situação ocupacional */}
      <div className="space-y-2">
        <Label>Situação Ocupacional do Autor *</Label>
        <Select
          value={formData.authorEmploymentStatus ?? ''}
          onValueChange={(v) => handleSelect('authorEmploymentStatus', v)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {['EMPREGADO', 'DESEMPREGADO', 'AUTÔNOMO', 'APOSENTADO', 'Outro'].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Flags principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="authorHasCriminalRecord"
            checked={!!formData.authorHasCriminalRecord}
            onCheckedChange={(c) => handleSelect('authorHasCriminalRecord', c)}
            className="border-gray-600"
          />
          <Label>Autor possui antecedentes criminais?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="authorHasBeenArrested"
            checked={!!formData.authorHasBeenArrested}
            onCheckedChange={(c) => handleSelect('authorHasBeenArrested', c)}
            className="border-gray-600"
          />
          <Label>Autor já foi preso?</Label>
        </div>
      </div>

      {/* Álcool */}
      <div className="flex items-center space-x-2">
        <Checkbox
          name="authorAlcoholUse"
          checked={!!formData.authorAlcoholUse}
          onCheckedChange={(c) => handleSelect('authorAlcoholUse', c)}
          className="border-gray-600"
        />
        <Label>Autor faz ou já fez uso de álcool?</Label>
      </div>
      {formData.authorAlcoholUse && (
        <div className="space-y-2">
          <Label>Frequência do Uso de Álcool *</Label>
          <Select
            value={formData.authorAlcoholUseFrequency ?? ''}
            onValueChange={(v) => handleSelect('authorAlcoholUseFrequency', v)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {['DIARIAMENTE', 'SEMANALMENTE', 'MENSALMENTE', 'OCASIONALMENTE', 'NÃO USA'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Outras flags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            name="authorChemicalDependencyTreatment"
            checked={!!formData.authorChemicalDependencyTreatment}
            onCheckedChange={(c) => handleSelect('authorChemicalDependencyTreatment', c)}
            className="border-gray-600"
          />
          <Label>Tratamento para dependência química?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="authorMentalDisorder"
            checked={!!formData.authorMentalDisorder}
            onCheckedChange={(c) => handleSelect('authorMentalDisorder', c)}
            className="border-gray-600"
          />
          <Label>Possui transtorno mental?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="authorControlledMedicationUse"
            checked={!!formData.authorControlledMedicationUse}
            onCheckedChange={(c) => handleSelect('authorControlledMedicationUse', c)}
            className="border-gray-600"
          />
          <Label>Usa medicação controlada?</Label>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          name="authorNotifiedAboutProtectiveMeasures"
          checked={!!formData.authorNotifiedAboutProtectiveMeasures}
          onCheckedChange={(c) => handleSelect('authorNotifiedAboutProtectiveMeasures', c)}
          className="border-gray-600"
        />
        <Label>Autor foi notificado sobre as medidas protetivas?</Label>
      </div>

      <div className="space-y-2">
        <Label>Observações Gerais</Label>
        <Textarea
          name="generalObservations"
          value={formData.generalObservations ?? ''}
          onChange={handleChange}
          className="bg-gray-700 border-gray-600 text-white"
          rows={4}
        />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// ARRAY DE PASSOS (IDs são usados pelo validador)
// -----------------------------------------------------------------------------
export const VictimFormSteps = [
  { id: 'visit_info',    title: 'Informações da Visita',      icon: Clock,  component: VictimVisitInfoStep },
  { id: 'personal_data', title: 'Dados Pessoais',            icon: User,   component: VictimPersonalDataStep },
  { id: 'violence_info', title: 'Informações sobre Violência',icon: Shield, component: VictimViolenceInfoStep },
  { id: 'author_info',   title: 'Informações do Autor',       icon: FileText, component: VictimAuthorInfoStep },
];

// -----------------------------------------------------------------------------
// HELPER DE PERSISTÊNCIA: cria ou atualiza conforme exista "id"
// -----------------------------------------------------------------------------
export async function saveVictimQuestionnaire(data, id = null) {
  if (id) return apiService.updateVictimQuestionnaire(id, data);
  return apiService.createVictimQuestionnaire(data);
}

export default VictimFormSteps;
