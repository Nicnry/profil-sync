import { useState } from 'react';
import Button from '@/components/ui/button';
import { Skill, SkillLevel } from '@/types/cv';
import { generateId } from '@/utils/helpers';

interface CVFormInputSkillsProps {
  id: string;
  skills?: Skill[];
  onChange?: (skills: Skill[]) => void;
  onRemove?: () => void;
  error?: string;
}

const CVFormInputSkills = ({ 
  id, 
  skills = [], 
  onChange,
  onRemove,
  error
}: CVFormInputSkillsProps) => {
  const [skillsList, setSkillsList] = useState<Skill[]>(skills);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>(SkillLevel.INTERMEDIATE);
  
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    
    const newSkill: Skill = {
      id: generateId('skill'),
      name: newSkillName.trim(),
      level: newSkillLevel
    };
    
    const updatedSkills = [...skillsList, newSkill];
    setSkillsList(updatedSkills);
    setNewSkillName('');
    
    if (onChange) {
      onChange(updatedSkills);
    }
  };
  
  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skillsList.filter(skill => skill.id !== skillId);
    setSkillsList(updatedSkills);
    
    if (onChange) {
      onChange(updatedSkills);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };
  
  const getLevelLabel = (level: SkillLevel): string => {
    switch (level) {
      case SkillLevel.BEGINNER:
        return 'Débutant';
      case SkillLevel.INTERMEDIATE:
        return 'Intermédiaire';
      case SkillLevel.ADVANCED:
        return 'Avancé';
      case SkillLevel.EXPERT:
        return 'Expert';
      default:
        return 'Intermédiaire';
    }
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
    <div id={id} className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div className="font-medium text-purple-800">Compétences</div>
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
        {skillsList.length > 0 ? (
          <div className="mb-3 space-y-2">
            {skillsList.map(skill => (
              <div 
                key={skill.id} 
                className="flex items-center justify-between p-2 bg-white rounded border border-purple-100"
              >
                <div className="flex items-center">
                  <span className="font-medium">{skill.name}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getLevelColor(skill.level)}`}>
                    {getLevelLabel(skill.level)}
                  </span>
                </div>
                <Button
                  variant="danger"
                  size="icon"
                  isRounded
                  onClick={() => handleRemoveSkill(skill.id)}
                  aria-label={`Supprimer ${skill.name}`}
                  title={`Supprimer ${skill.name}`}
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
            Aucune compétence ajoutée
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Nom de la compétence"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
            >
              <option value={SkillLevel.BEGINNER}>Débutant</option>
              <option value={SkillLevel.INTERMEDIATE}>Intermédiaire</option>
              <option value={SkillLevel.ADVANCED}>Avancé</option>
              <option value={SkillLevel.EXPERT}>Expert</option>
            </select>
          </div>
        </div>
        
        <div className="mt-2 flex justify-center">
          <Button
            variant="primary"
            onClick={handleAddSkill}
            disabled={!newSkillName.trim()}
            className="w-full"
          >
            Ajouter la compétence
          </Button>
        </div>
        
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CVFormInputSkills;