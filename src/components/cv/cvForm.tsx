'use client';

import { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import CVFormColumnSelector from '@/components/cv/selectors/cvFormColumnSelector';
import CVFormColumnContainer from '@/components/cv/blocks/cvFormColumnContainer';
import Button from '@/components/ui/button';
import { countAllBlocks, countAllComponents } from '@/utils/helpers';
import { BlockInfo, CVFormInputs, ColumnCount } from '@/types/cv';

const CVForm = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    watch,
    formState: { errors } 
  } = useForm<CVFormInputs>({
    defaultValues: {
      columns: 1
    }
  });
  
  const selectedColumns = watch('columns');
  
  const onSubmit: SubmitHandler<CVFormInputs> = (data) => {
    const formData = {
      ...data,
      blocks
    };
    
    console.log('Données du formulaire:', formData, data, blocks);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };
  
  const handleColumnsChange = (columns: ColumnCount) => {
    setValue('columns', columns);
  };
  
  const handleBlocksChange = useCallback((updatedBlocks: BlockInfo[]) => {
    setBlocks(updatedBlocks);
  }, []);
  
  const renderBlockDebugList = (blocks: BlockInfo[], depth = 0) => {
    return blocks.map(block => (
      <li key={block.id} className="ml-4">
        {'  '.repeat(depth)}• Colonne {block.columnIndex + 1}: {block.title || 'Sans titre'}
        {block.components && block.components.length > 0 && (
          <span className="text-purple-600 text-xs ml-2">
            ({block.components.length} champ{block.components.length > 1 ? 's' : ''})
          </span>
        )}
        
        {block.children && block.children.length > 0 && (
          <ul className="text-xs text-gray-600 space-y-1 ml-4">
            {block.children.map(child => (
              <li key={child.id}>
                {'  '.repeat(depth + 1)}◦ {child.title || 'Sans titre'}
                {child.components && child.components.length > 0 && (
                  <span className="text-purple-600 text-xs ml-2">
                    ({child.components.length} champ{child.components.length > 1 ? 's' : ''})
                  </span>
                )}
                
                {child.children && child.children.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1 ml-4">
                    {child.children.map(grandChild => (
                      <li key={grandChild.id}>
                        {'  '.repeat(depth + 2)}▪ {grandChild.title || 'Sans titre'}
                        {grandChild.components && grandChild.components.length > 0 && (
                          <span className="text-purple-600 text-xs ml-2">
                            ({grandChild.components.length} champ{grandChild.components.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };
  
  const totalBlockCount = countAllBlocks(blocks);
  const totalComponentCount = countAllComponents(blocks);
  
  // Vérifier si des erreurs existent dans le formulaire
  const hasErrors = Object.keys(errors).length > 0;
  
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
            {errors.columns && (
              <li>Vous devez sélectionner un nombre de colonnes valide</li>
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
          {...register('columns', { 
            required: "Vous devez sélectionner un nombre de colonnes" 
          })} 
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de colonnes
          </label>
          <CVFormColumnSelector 
            value={selectedColumns} 
            onChange={handleColumnsChange} 
          />
          {errors.columns && (
            <p className="mt-1 text-sm text-red-600">{errors.columns.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Structure du CV</h3>
          <p className="text-sm text-gray-600 mb-4">
            Ajoutez des blocs à chaque colonne en cliquant sur le bouton &quot;+&quot;.
            Cliquez sur le titre d&apos;un bloc pour le modifier.
            Utilisez le bouton violet pour ajouter des champs et le bouton bleu pour ajouter des sous-blocs.
          </p>
          <CVFormColumnContainer 
            columns={selectedColumns} 
            onChange={handleBlocksChange} 
          />
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
            <ul className="text-xs text-gray-600 space-y-1">
              {renderBlockDebugList(blocks)}
            </ul>
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