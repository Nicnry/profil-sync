'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import CVFormRowSelector from '@/components/cv/selectors/cvFormRowSelector';
import CVFormRowContainer from '@/components/cv/blocks/cvFormRowContainer';
import BlockDebugList from '@/components/cv/debug/blockDebugList';
import Button from '@/components/ui/button';
import { countAllBlocks, countAllComponents } from '@/utils/helpers';
import { CVFormInputs, RowCount } from '@/types/cv';
import { useCV } from '@/context/cvContext';

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
  
  const onSubmit: SubmitHandler<CVFormInputs> = (data) => {
    saveCV(data);
  };
  
  const handleRowCountChange = (newRowCount: RowCount) => {
    setValue('rowCount', newRowCount);
    setRowCount(newRowCount);
  };
  
  const totalBlockCount = countAllBlocks(blocks);
  const totalComponentCount = countAllComponents(blocks);
  
  const hasErrors = Object.keys(errors).length > 0;
  
  const getRowDescription = (index: number, totalRows: number) => {
    if (totalRows === 1) return "pleine page";
    if (totalRows === 2) {
      return index === 0 ? "en-tête" : "contenu principal";
    }
    if (totalRows === 3) {
      if (index === 0) return "en-tête";
      if (index === 1) return "contenu principal";
      return "pied de page";
    }
    return `rangée ${index + 1}`;
  };
  
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Mise en page du CV</h2>
      
      {isSubmitted && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded">
          Configuration enregistrée ! Vérifiez la console pour voir les détails.
        </div>
      )}
      
      {hasErrors && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
          <p className="font-medium">Veuillez corriger les erreurs suivantes :</p>
          <ul className="list-disc pl-5 mt-2">
            {errors.rowCount && (
              <li>Vous devez sélectionner un nombre de rangées valide</li>
            )}
            {errors.blocks && (
              <li>Veuillez configurer au moins un bloc pour votre CV</li>
            )}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input 
          type="hidden" 
          {...register('rowCount', { 
            required: "Vous devez sélectionner un nombre de rangées" 
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
          <div className="mt-2 text-xs text-gray-500">
            <ul className="list-disc pl-4">
              {selectedRowCount >= 1 && (
                <li>Rangée 1: {getRowDescription(0, selectedRowCount)}</li>
              )}
              {selectedRowCount >= 2 && (
                <li>Rangée 2: {getRowDescription(1, selectedRowCount)}</li>
              )}
              {selectedRowCount >= 3 && (
                <li>Rangée 3: {getRowDescription(2, selectedRowCount)}</li>
              )}
            </ul>
          </div>
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
        
        {blocks.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2 text-sm text-gray-700">
              Structure actuelle ({totalBlockCount} blocs, {totalComponentCount} champs)
            </h4>
            <BlockDebugList blocks={blocks} />
          </div>
        )}
        
        <div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={hasErrors}
          >
            Enregistrer la mise en page
          </Button>
          {hasErrors && (
            <p className="mt-2 text-sm text-red-600 text-center">
              Veuillez corriger les erreurs avant d&apos;enregistrer
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CVForm;