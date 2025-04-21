import { useState } from 'react';
import Button from '@/components/ui/button';
import { Language, SkillLevel } from '@/types/cv';
import { generateId } from '@/utils/helpers';

interface CVFormInputLanguagesProps {
  id: string;
  languages?: Language[];
  onChange?: (languages: Language[]) => void;
  onRemove?: () => void;
  error?: string;
}

const LANGUAGE_LEVELS = [
  { value: SkillLevel.BEGINNER, label: 'A1/A2 - Débutant' },
  { value: SkillLevel.INTERMEDIATE, label: 'B1/B2 - Intermédiaire' },
  { value: SkillLevel.ADVANCED, label: 'C1 - Avancé' },
  { value: SkillLevel.EXPERT, label: 'C2 - Bilingue/Natif' }
];

const CVFormInputLanguages = ({ 
  id, 
  languages = [], 
  onChange,
  onRemove,
  error
}: CVFormInputLanguagesProps) => {
  const [languagesList, setLanguagesList] = useState<Language[]>(languages);
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState<SkillLevel>(SkillLevel.INTERMEDIATE);
  
  const handleAddLanguage = () => {
    if (!newLanguageName.trim()) return;
    
    const newLanguage: Language = {
      id: generateId('lang'),
      name: newLanguageName.trim(),
      level: newLanguageLevel
    };
    
    const updatedLanguages = [...languagesList, newLanguage];
    setLanguagesList(updatedLanguages);
    setNewLanguageName('');
    
    if (onChange) {
      onChange(updatedLanguages);
    }
  };
  
  const handleRemoveLanguage = (langId: string) => {
    const updatedLanguages = languagesList.filter(lang => lang.id !== langId);
    setLanguagesList(updatedLanguages);
    
    if (onChange) {
      onChange(updatedLanguages);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLanguage();
    }
  };
  
  const getLevelLabel = (level: SkillLevel): string => {
    return LANGUAGE_LEVELS.find(l => l.value === level)?.label || LANGUAGE_LEVELS[1].label;
  };
  
  const getLevelColor = (level: SkillLevel): string => {
    switch (level) {
      case SkillLevel.BEGINNER:
        return 'bg-gray-200';
      case SkillLevel.INTERMEDIATE:
        return 'bg-blue-200';
      case SkillLevel.ADVANCED:
        return 'bg-purple-200';
      case SkillLevel.EXPERT:
        return 'bg-green-200';
      default:
        return 'bg-blue-200';
    }
  };

  return (
    <div id={id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div className="font-medium text-indigo-800">Langues</div>
        {onRemove && (
          <Button 
            variant="danger"
            size="icon"
            isRounded
            onClick={onRemove}
            aria-label="Supprimer ce champ"
            title="Supprimer ce champ"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        )}
      </div>
      
      <div className="mt-3">
        {languagesList.length > 0 ? (
          <div className="mb-3 space-y-2">
            {languagesList.map(lang => (
              <div 
                key={lang.id} 
                className="flex items-center justify-between p-2 bg-white rounded border border-indigo-100"
              >
                <div className="flex items-center">
                  <span className="font-medium">{lang.name}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getLevelColor(lang.level)}`}>
                    {getLevelLabel(lang.level)}
                  </span>
                </div>
                <Button
                  variant="danger"
                  size="icon"
                  isRounded
                  onClick={() => handleRemoveLanguage(lang.id)}
                  aria-label={`Supprimer ${lang.name}`}
                  title={`Supprimer ${lang.name}`}
                  className="h-6 w-6"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 italic mb-3">
            Aucune langue ajoutée
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Nom de la langue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newLanguageName}
              onChange={(e) => setNewLanguageName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newLanguageLevel}
              onChange={(e) => setNewLanguageLevel(e.target.value as SkillLevel)}
            >
              {LANGUAGE_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-2 flex justify-center">
          <Button
            variant="primary"
            onClick={handleAddLanguage}
            disabled={!newLanguageName.trim()}
            className="w-full"
          >
            Ajouter la langue
          </Button>
        </div>
        
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CVFormInputLanguages;