'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import CVFormRowSelector from '@/components/cv/selectors/cvFormRowSelector';
import CVFormRowContainer from '@/components/cv/blocks/cvFormRowContainer';
import Button from '@/components/ui/button';
import { CVFormInputs, RowCount } from '@/types/cv';
import { useCV } from '@/context/cvContext';
import FormErrors, { ERROR_MESSAGES } from '@/components/cv/form/formErrors';
import SuccessMessage from '@/components/cv/form/successMessage';
import RowDescription from '@/components/cv/form/rowDescription';
import DebugSection from '@/components/cv/form/debugSection';
import ExportPdfButton from '@/components/cv/exportPdfButton';

const CVForm = () => {
  const { 
    blocks,
    isSubmitted,
    setRowCount,
    saveCV,
    getRowCount
  } = useCV();
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    watch,
    formState: { errors } 
  } = useForm<CVFormInputs>({
    defaultValues: {
      rowCount: getRowCount() as RowCount,
      blocks: blocks
    }
  });
  
  const selectedRowCount = watch('rowCount');
  
  const onSubmit: SubmitHandler<CVFormInputs> = useCallback((data) => {
    saveCV(data);
  }, [saveCV]);
  
  const handleRowCountChange = useCallback((newRowCount: RowCount) => {
    setValue('rowCount', newRowCount);
    setRowCount(newRowCount);
  }, [setValue, setRowCount]);
  
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);
  
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Mise en page du CV</h2>
      
      {isSubmitted && <SuccessMessage />}
      
      {hasErrors && <FormErrors errors={errors} />}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input 
          type="hidden" 
          {...register('rowCount', { 
            required: ERROR_MESSAGES.REQUIRED_ROW_COUNT 
          })} 
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Structure de la page
          </label>
          <CVFormRowSelector 
            value={selectedRowCount} 
            onChange={handleRowCountChange} 
          />
          {errors.rowCount && (
            <p className="mt-1 text-sm text-red-600">{errors.rowCount.message}</p>
          )}
          
          <RowDescription 
            rowCount={getRowCount() as RowCount}
            selectedRowCount={selectedRowCount}
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Structure du CV</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choisissez le nombre de colonnes pour chaque rangée, puis ajoutez des blocs
            en cliquant sur le bouton &quot;+&quot;. Cliquez sur le titre d&apos;un bloc pour le modifier.
            Utilisez le bouton violet pour ajouter des champs et le bouton bleu pour ajouter des sous-blocs.
          </p>
          <CVFormRowContainer />
          {blocks.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              Aucun bloc ajouté. Ajoutez au moins un bloc pour créer votre mise en page.
            </p>
          )}
        </div>
        
        <DebugSection blocks={blocks} />
        
        <div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={hasErrors}
          >
            Enregistrer la mise en page
          </Button>
          <ExportPdfButton />
          {hasErrors && (
            <p className="mt-2 text-sm text-red-600 text-center">
              {ERROR_MESSAGES.FIX_ERRORS}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CVForm;