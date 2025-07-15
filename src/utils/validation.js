import { toast } from 'react-toastify';

// Campos obrigatórios para Vítima baseados no modelo
export const VICTIM_REQUIRED_FIELDS = {
  // Passo 1: Informações da Visita
  victimPresence: 'Presença da vítima é obrigatória',
  attendanceType: 'Tipo de atendimento é obrigatório',
  municipality: 'Município é obrigatório',
  visitDate: 'Data da visita é obrigatória',
  visitTime: 'Hora da visita é obrigatória',
  
  // Passo 2: Dados Pessoais
  victimName: 'Nome da vítima é obrigatório',
  birthDate: 'Data de nascimento é obrigatória',
  hasChildren: 'Informação sobre filhos é obrigatória',
  housingCondition: 'Condição de moradia é obrigatória',
  substanceUse: 'Informação sobre uso de substâncias é obrigatória',
  
  
  // Passo 3: Informações sobre Violência
  protectiveMeasuresComplied: 'Informação sobre cumprimento de medidas protetivas é obrigatória',
  contactFrequency: 'Frequência de contato é obrigatória',
  lastContactPeriod: 'Período do último contato é obrigatório',
  hasViolenceMarks: 'Informação sobre marcas de violência é obrigatória',
  relationshipWithAuthor: 'Relacionamento com autor é obrigatório',
  
  // Passo 4: Informações do Autor
  authorName: 'Nome do autor é obrigatório',
  authorAddress: 'Endereço do autor é obrigatório',
  authorPerimeter: 'Perímetro do autor é obrigatório',
  authorGender: 'Sexo do autor é obrigatório',
  authorEmploymentStatus: 'Situação ocupacional do autor é obrigatória',
  authorHasCriminalRecord: 'Informação sobre antecedentes do autor é obrigatória',
  authorHasBeenArrested: 'Informação sobre prisão do autor é obrigatória',
  authorAlcoholUse: 'Informação sobre uso de álcool do autor é obrigatória',
  authorChemicalDependencyTreatment: 'Informação sobre tratamento do autor é obrigatória',
  authorMentalDisorder: 'Informação sobre transtorno mental do autor é obrigatória',
  authorControlledMedicationUse: 'Informação sobre medicação controlada do autor é obrigatória',
  authorNotifiedAboutProtectiveMeasures: 'Informação sobre notificação do autor é obrigatória'
};

// Campos condicionalmente obrigatórios para Vítima
export const VICTIM_CONDITIONAL_FIELDS = {
  otherVictimPresence: (data) => data.victimPresence === 'Outro',
  otherAttendanceType: (data) => data.attendanceType === 'Outro',
  newAddress: (data) => data.victimPresence === 'MUDANÇA DE ENDEREÇO',
  otherMunicipality: (data) => data.municipality === 'Outro',
  otherHousingCondition: (data) => data.housingCondition === 'Outro',
  substanceDetails: (data) => data.substanceUse === true,
  otherRelationshipWithAuthor: (data) => data.relationshipWithAuthor === 'Outro',
  nonComplianceDetails: (data) => data.protectiveMeasuresComplied === false,
  currentViolenceTypes: (data) => data.hasViolenceMarks === true,
  authorAlcoholUseFrequency: (data) => data.authorAlcoholUse === true
};

// Campos obrigatórios para Autor baseados no modelo
export const AUTHOR_REQUIRED_FIELDS = {
  // Passo 1: Informações da Visita e Processo
  authorPresence: 'Presença do autor é obrigatória',
  attendanceType: 'Tipo de atendimento é obrigatório',
  visitingUnit: 'Unidade de visita é obrigatória',
  varaFamily: 'Vara familiar é obrigatória',
  numberProcess: 'Número do processo é obrigatório',
  visitDate: 'Data da visita é obrigatória',
  visitTime: 'Horário da visita é obrigatório',
  
  // Passo 2: Dados Pessoais
  authorName: 'Nome do autor é obrigatório',
  victimName: 'Nome da vítima é obrigatório',
  authorBirthDate: 'Data de nascimento do autor é obrigatória',
  authorRG: 'RG do autor é obrigatório',
  authorCPF: 'CPF do autor é obrigatório',
  authorGender: 'Sexo do autor é obrigatório',
  authorEthnicity: 'Etnia do autor é obrigatória',
  authorEducationLevel: 'Escolaridade do autor é obrigatória',
  authorMaritalStatus: 'Estado civil do autor é obrigatório',
  authorEmployed: 'Informação sobre trabalho do autor é obrigatória',
  authorIncome: 'Renda do autor é obrigatória',
  
  // Passo 3: Endereço e Relacionamento
  authorAddress: 'Endereço do autor é obrigatório',
  authorNeighborhood: 'Bairro do autor é obrigatório',
  authorMunicipality: 'Município do autor é obrigatório',
  relationshipWithVictim: 'Relacionamento com vítima é obrigatório',
  hasChildrenWithVictim: 'Informação sobre filhos com vítima é obrigatória',
  
  // Passo 4: Substâncias e Comportamento
  substanceUse: 'Informação sobre uso de substâncias é obrigatória',
  hasCriminalRecord: 'Informação sobre antecedentes é obrigatória',
  hasBeenArrested: 'Informação sobre prisão é obrigatória',
  alcoholUse: 'Informação sobre uso de álcool é obrigatória',
  drugUse: 'Informação sobre uso de drogas é obrigatória',
  chemicalDependencyTreatment: 'Informação sobre tratamento é obrigatória',
  mentalDisorders: 'Informação sobre transtornos mentais é obrigatória',
  
  // Passo 5: Medidas Protetivas
  protectiveMeasuresComplied: 'Informação sobre cumprimento de medidas é obrigatória',
  lastContactDate: 'Data do último contato é obrigatória',
  contactFrequency: 'Frequência de contato é obrigatória',
  notifiedAboutProtectiveMeasures: 'Informação sobre notificação é obrigatória',
  agreesWithQuestionnaire: 'Concordância com questionário é obrigatória',
  residesNearVictim: 'Informação sobre proximidade residencial é obrigatória',
  lastContactWithVictimDate: 'Data do último contato com vítima é obrigatória',
  authorOrFamilyNearVictim: 'Informação sobre proximidade familiar é obrigatória'
};

// Campos condicionalmente obrigatórios para Autor
export const AUTHOR_CONDITIONAL_FIELDS = {
  otherAuthorPresence: (data) => data.authorPresence === 'Outro',
  otherAttendanceType: (data) => data.attendanceType === 'Outro',
  otherMunicipality: (data) => data.authorMunicipality === 'Outro',
  numberOfChildrenWithVictim: (data) => data.hasChildrenWithVictim === true,
  substanceDetails: (data) => data.substanceUse === true,
  nonComplianceDetails: (data) => data.protectiveMeasuresComplied === false,
  alcoholUseFrequency: (data) => data.alcoholUse === true,
  drugDetails: (data) => data.drugUse === true,
  drugUseFrequency: (data) => data.drugUse === true,
  complyingWithProtectiveMeasures: (data) => data.notifiedAboutProtectiveMeasures === true
};

// Função para validar campos obrigatórios
export const validateRequiredFields = (data, requiredFields, conditionalFields = {}) => {
  const missingFields = [];
  
  // Verificar campos obrigatórios básicos
  Object.keys(requiredFields).forEach(field => {
    const value = data[field];
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      missingFields.push(requiredFields[field]);
    }
  });
  
  // Verificar campos condicionalmente obrigatórios
  Object.keys(conditionalFields).forEach(field => {
    const condition = conditionalFields[field];
    if (condition(data)) {
      const value = data[field];
      if (value === undefined || value === null || value === '' ||
          (Array.isArray(value) && value.length === 0)) {
        missingFields.push(`${field} é obrigatório quando a condição é atendida`);
      }
    }
  });
  
  return missingFields;
};

// Função para mostrar toast de campos obrigatórios
export const showRequiredFieldsToast = (missingFields) => {
  if (missingFields.length > 0) {
    const message = missingFields.length === 1 
      ? missingFields[0]
      : `${missingFields.length} campos obrigatórios não preenchidos:\n• ${missingFields.slice(0, 3).join('\n• ')}${missingFields.length > 3 ? '\n• ...' : ''}`;
    
    toast.error(message, {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        whiteSpace: 'pre-line'
      }
    });
    return false;
  }
  return true;
};

// Função para validar um passo específico do formulário de vítima
export const validateVictimStep = (stepId, data) => {
  let stepRequiredFields = {};
  let stepConditionalFields = {};
  
  switch (stepId) {
    case 'visit_info':
      stepRequiredFields = {
        victimPresence: VICTIM_REQUIRED_FIELDS.victimPresence,
        attendanceType: VICTIM_REQUIRED_FIELDS.attendanceType,
        municipality: VICTIM_REQUIRED_FIELDS.municipality,
        visitDate: VICTIM_REQUIRED_FIELDS.visitDate,
        visitTime: VICTIM_REQUIRED_FIELDS.visitTime
      };
      stepConditionalFields = {
        otherVictimPresence: VICTIM_CONDITIONAL_FIELDS.otherVictimPresence,
        otherAttendanceType: VICTIM_CONDITIONAL_FIELDS.otherAttendanceType,
        newAddress: VICTIM_CONDITIONAL_FIELDS.newAddress,
        otherMunicipality: VICTIM_CONDITIONAL_FIELDS.otherMunicipality
      };
      break;
      
    case 'personal_data':
      stepRequiredFields = {
        victimName: VICTIM_REQUIRED_FIELDS.victimName,
        birthDate: VICTIM_REQUIRED_FIELDS.birthDate,
        hasChildren: VICTIM_REQUIRED_FIELDS.hasChildren,
        housingCondition: VICTIM_REQUIRED_FIELDS.housingCondition,
        substanceUse: VICTIM_REQUIRED_FIELDS.substanceUse,
      };
      stepConditionalFields = {
        otherHousingCondition: VICTIM_CONDITIONAL_FIELDS.otherHousingCondition,
        substanceDetails: VICTIM_CONDITIONAL_FIELDS.substanceDetails,
        
      };
      break;
      
      case 'violence_info':
        stepRequiredFields = {
          protectiveMeasuresComplied: VICTIM_REQUIRED_FIELDS.protectiveMeasuresComplied,
          contactFrequency: VICTIM_REQUIRED_FIELDS.contactFrequency,
          lastContactPeriod: VICTIM_REQUIRED_FIELDS.lastContactPeriod,
          hasViolenceMarks: VICTIM_REQUIRED_FIELDS.hasViolenceMarks,
          relationshipWithAuthor: VICTIM_REQUIRED_FIELDS.relationshipWithAuthor
      };
      stepConditionalFields = {
        nonComplianceDetails: VICTIM_CONDITIONAL_FIELDS.nonComplianceDetails,
        currentViolenceTypes: VICTIM_CONDITIONAL_FIELDS.currentViolenceTypes,
        otherRelationshipWithAuthor: VICTIM_CONDITIONAL_FIELDS.otherRelationshipWithAuthor
      };
      break;
      
    case 'author_info':
      stepRequiredFields = {
        authorName: VICTIM_REQUIRED_FIELDS.authorName,
        authorAddress: VICTIM_REQUIRED_FIELDS.authorAddress,
        authorPerimeter: VICTIM_REQUIRED_FIELDS.authorPerimeter,
        authorGender: VICTIM_REQUIRED_FIELDS.authorGender,
        authorEmploymentStatus: VICTIM_REQUIRED_FIELDS.authorEmploymentStatus,
        authorHasCriminalRecord: VICTIM_REQUIRED_FIELDS.authorHasCriminalRecord,
        authorHasBeenArrested: VICTIM_REQUIRED_FIELDS.authorHasBeenArrested,
        authorAlcoholUse: VICTIM_REQUIRED_FIELDS.authorAlcoholUse,
        authorChemicalDependencyTreatment: VICTIM_REQUIRED_FIELDS.authorChemicalDependencyTreatment,
        authorMentalDisorder: VICTIM_REQUIRED_FIELDS.authorMentalDisorder,
        authorControlledMedicationUse: VICTIM_REQUIRED_FIELDS.authorControlledMedicationUse,
        authorNotifiedAboutProtectiveMeasures: VICTIM_REQUIRED_FIELDS.authorNotifiedAboutProtectiveMeasures
      };
      stepConditionalFields = {
        authorAlcoholUseFrequency: VICTIM_CONDITIONAL_FIELDS.authorAlcoholUseFrequency
      };
      break;
  }
  
  const missingFields = validateRequiredFields(data, stepRequiredFields, stepConditionalFields);
  return showRequiredFieldsToast(missingFields);
};

// Função para validar um passo específico do formulário de autor
export const validateAuthorStep = (stepId, data) => {
  let stepRequiredFields = {};
  let stepConditionalFields = {};
  
  switch (stepId) {
    case 'visit_process_info':
      stepRequiredFields = {
        authorPresence: AUTHOR_REQUIRED_FIELDS.authorPresence,
        attendanceType: AUTHOR_REQUIRED_FIELDS.attendanceType,
        visitingUnit: AUTHOR_REQUIRED_FIELDS.visitingUnit,
        varaFamily: AUTHOR_REQUIRED_FIELDS.varaFamily,
        numberProcess: AUTHOR_REQUIRED_FIELDS.numberProcess,
        visitDate: AUTHOR_REQUIRED_FIELDS.visitDate,
        visitTime: AUTHOR_REQUIRED_FIELDS.visitTime
      };
      stepConditionalFields = {
        otherAuthorPresence: AUTHOR_CONDITIONAL_FIELDS.otherAuthorPresence,
        otherAttendanceType: AUTHOR_CONDITIONAL_FIELDS.otherAttendanceType
      };
      break;
      
    case 'personal_data':
      stepRequiredFields = {
        authorName: AUTHOR_REQUIRED_FIELDS.authorName,
        victimName: AUTHOR_REQUIRED_FIELDS.victimName,
        authorBirthDate: AUTHOR_REQUIRED_FIELDS.authorBirthDate,
        authorRG: AUTHOR_REQUIRED_FIELDS.authorRG,
        authorCPF: AUTHOR_REQUIRED_FIELDS.authorCPF,
        authorGender: AUTHOR_REQUIRED_FIELDS.authorGender,
        authorEthnicity: AUTHOR_REQUIRED_FIELDS.authorEthnicity,
        authorEducationLevel: AUTHOR_REQUIRED_FIELDS.authorEducationLevel,
        authorMaritalStatus: AUTHOR_REQUIRED_FIELDS.authorMaritalStatus,
        authorEmployed: AUTHOR_REQUIRED_FIELDS.authorEmployed,
        authorIncome: AUTHOR_REQUIRED_FIELDS.authorIncome
      };
      break;
      
    case 'address_relationship':
      stepRequiredFields = {
        authorAddress: AUTHOR_REQUIRED_FIELDS.authorAddress,
        authorNeighborhood: AUTHOR_REQUIRED_FIELDS.authorNeighborhood,
        authorMunicipality: AUTHOR_REQUIRED_FIELDS.authorMunicipality,
        relationshipWithVictim: AUTHOR_REQUIRED_FIELDS.relationshipWithVictim,
        hasChildrenWithVictim: AUTHOR_REQUIRED_FIELDS.hasChildrenWithVictim
      };
      stepConditionalFields = {
        otherMunicipality: AUTHOR_CONDITIONAL_FIELDS.otherMunicipality,
        numberOfChildrenWithVictim: AUTHOR_CONDITIONAL_FIELDS.numberOfChildrenWithVictim
      };
      break;
      
    case 'substance_behavior':
      stepRequiredFields = {
        substanceUse: AUTHOR_REQUIRED_FIELDS.substanceUse,
        hasCriminalRecord: AUTHOR_REQUIRED_FIELDS.hasCriminalRecord,
        hasBeenArrested: AUTHOR_REQUIRED_FIELDS.hasBeenArrested,
        alcoholUse: AUTHOR_REQUIRED_FIELDS.alcoholUse,
        drugUse: AUTHOR_REQUIRED_FIELDS.drugUse,
        chemicalDependencyTreatment: AUTHOR_REQUIRED_FIELDS.chemicalDependencyTreatment,
        mentalDisorders: AUTHOR_REQUIRED_FIELDS.mentalDisorders
      };
      stepConditionalFields = {
        substanceDetails: AUTHOR_CONDITIONAL_FIELDS.substanceDetails,
        alcoholUseFrequency: AUTHOR_CONDITIONAL_FIELDS.alcoholUseFrequency,
        drugDetails: AUTHOR_CONDITIONAL_FIELDS.drugDetails,
        drugUseFrequency: AUTHOR_CONDITIONAL_FIELDS.drugUseFrequency
      };
      break;
      
    case 'protective_measures':
      stepRequiredFields = {
        protectiveMeasuresComplied: AUTHOR_REQUIRED_FIELDS.protectiveMeasuresComplied,
        lastContactDate: AUTHOR_REQUIRED_FIELDS.lastContactDate,
        contactFrequency: AUTHOR_REQUIRED_FIELDS.contactFrequency,
        notifiedAboutProtectiveMeasures: AUTHOR_REQUIRED_FIELDS.notifiedAboutProtectiveMeasures,
        agreesWithQuestionnaire: AUTHOR_REQUIRED_FIELDS.agreesWithQuestionnaire,
        residesNearVictim: AUTHOR_REQUIRED_FIELDS.residesNearVictim,
        lastContactWithVictimDate: AUTHOR_REQUIRED_FIELDS.lastContactWithVictimDate,
        authorOrFamilyNearVictim: AUTHOR_REQUIRED_FIELDS.authorOrFamilyNearVictim
      };
      stepConditionalFields = {
        nonComplianceDetails: AUTHOR_CONDITIONAL_FIELDS.nonComplianceDetails,
        complyingWithProtectiveMeasures: AUTHOR_CONDITIONAL_FIELDS.complyingWithProtectiveMeasures
      };
      break;
  }
  
  const missingFields = validateRequiredFields(data, stepRequiredFields, stepConditionalFields);
  return showRequiredFieldsToast(missingFields);
};

