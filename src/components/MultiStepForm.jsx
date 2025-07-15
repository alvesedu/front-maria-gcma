// src/components/MultiStepForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { validateVictimStep, validateAuthorStep } from '@/utils/validation';

/**
 * Componente genérico de formulário multi‑etapas.
 * Cada step é um componente "burro" que recebe apenas `data` e `onChange`.
 */
export default function MultiStepForm({
  steps = [],
  onSubmit,
  onCancel,
  title = 'Formulário de Cadastro',
  description = 'Preencha as informações nos passos abaixo',
  initialData = {},
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */
  const isVictimForm = title.toLowerCase().includes('vítima');
  const isAuthorForm = title.toLowerCase().includes('autor');

  const validateStep = useCallback(
    (index) => {
      const step = steps[index];
      if (!step) return true; // fallback

      if (isVictimForm) return validateVictimStep(step.id, formData);
      if (isAuthorForm) return validateAuthorStep(step.id, formData);
      return true; // se não houver validações específicas
    },
    [formData, isVictimForm, isAuthorForm, steps]
  );

  /* ------------------------------------------------------------------ */
  /* Navegação                                                          */
  /* ------------------------------------------------------------------ */
  function handleNext() {
    if (!validateStep(currentStep)) return; // erros já mostrados pelo Step

    if (currentStep < steps.length - 1) {
      setCurrentStep((i) => i + 1);
    }
  }

  function handlePrevious() {
    if (currentStep > 0) setCurrentStep((i) => i - 1);
  }

  async function handleFinish() {
    if (!validateStep(currentStep)) return;

    try {
      await onSubmit(formData);
      toast.success('Formulário enviado com sucesso!', { theme: 'dark' });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar formulário. Tente novamente.', { theme: 'dark' });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Atualização de dados                                               */
  /* ------------------------------------------------------------------ */
  const updateFormData = (patch) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  /* Se o "pai" alterar `initialData` depois, sincroniza */
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  const StepComponent = steps[currentStep].component;
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Título */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">{title}</CardTitle>
          <p className="text-gray-400">{description}</p>
        </CardHeader>
      </Card>

      {/* Barra de progresso */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
            <span>
              Passo {currentStep + 1} de {steps.length}
            </span>
            <span>{progress}% concluído</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all" /* tailwind */
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Indicadores numéricos */}
          <div className="flex justify-between mt-4">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    idx < currentStep
                      ? 'bg-blue-600 text-white'
                      : idx === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs mt-2 max-w-20 text-center ${
                    idx <= currentStep ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo do passo */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            {steps[currentStep].icon && React.createElement(steps[currentStep].icon, { className: 'h-5 w-5' })}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <StepComponent data={formData} onChange={updateFormData} />
        </CardContent>
      </Card>

      {/* Navegação */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={handlePrevious}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
            </Button>

            <div className="flex gap-3">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Cancelar
                </Button>
              )}

              {currentStep === steps.length - 1 ? (
                <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-2" /> Finalizar
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Próximo <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aviso de campos obrigatórios */}
      <Card className="bg-yellow-900/20 border-yellow-600/30">
        <CardContent className="p-4 text-yellow-400 text-sm flex items-start gap-2">
          <div className="w-2 h-2 mt-2 bg-yellow-400 rounded-full" />
          <span>
            <strong>Campos obrigatórios:</strong> Os campos marcados com <code>*</code> são obrigatórios. O sistema
            notifica se houver pendências.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
