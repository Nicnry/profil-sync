import { useState } from 'react';
import Button from '@/components/ui/button';
import { BulletItem } from '@/types/cv';
import { generateId } from '@/utils/helpers';

interface CVFormInputBulletListProps {
  id: string;
  items?: BulletItem[];
  onChange?: (items: BulletItem[]) => void;
  onRemove?: () => void;
  error?: string;
}

const CVFormInputBulletList = ({ 
  id, 
  items = [], 
  onChange,
  onRemove,
  error
}: CVFormInputBulletListProps) => {
  const [bulletItems, setBulletItems] = useState<BulletItem[]>(items);
  const [newItemText, setNewItemText] = useState<string>('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  
  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: BulletItem = {
      id: generateId('bullet'),
      text: newItemText.trim()
    };
    
    const updatedItems = [...bulletItems, newItem];
    setBulletItems(updatedItems);
    setNewItemText('');
    
    if (onChange) {
      onChange(updatedItems);
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    const updatedItems = bulletItems.filter(item => item.id !== itemId);
    setBulletItems(updatedItems);
    
    if (onChange) {
      onChange(updatedItems);
    }
  };
  
  const handleEditStart = (item: BulletItem) => {
    setEditingItem(item.id);
    setEditText(item.text);
  };
  
  const handleEditSave = () => {
    if (!editingItem || !editText.trim()) {
      setEditingItem(null);
      return;
    }
    
    const updatedItems = bulletItems.map(item => 
      item.id === editingItem 
        ? { ...item, text: editText.trim() } 
        : item
    );
    
    setBulletItems(updatedItems);
    setEditingItem(null);
    
    if (onChange) {
      onChange(updatedItems);
    }
  };
  
  const handleEditCancel = () => {
    setEditingItem(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, isNew: boolean = true) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isNew) {
        handleAddItem();
      } else {
        handleEditSave();
      }
    } else if (e.key === 'Escape' && !isNew) {
      handleEditCancel();
    }
  };
  
  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const currentIndex = bulletItems.findIndex(item => item.id === itemId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === bulletItems.length - 1)
    ) {
      return;
    }
    
    const newItems = [...bulletItems];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    setBulletItems(newItems);
    
    if (onChange) {
      onChange(newItems);
    }
  };

  return (
    <div id={id} className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div className="font-medium text-teal-800">Liste à puces</div>
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
        {bulletItems.length > 0 ? (
          <div className="mb-3 space-y-2">
            {bulletItems.map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-start bg-white rounded border border-teal-100 p-2"
              >
                <div className="mr-2 mt-1 text-teal-600">•</div>
                
                {editingItem === item.id ? (
                  <div className="flex-grow">
                    <textarea
                      className="w-full px-2 py-1 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, false)}
                      rows={2}
                      autoFocus
                    />
                    <div className="flex justify-end mt-1 space-x-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleEditCancel}
                        className="text-xs py-1 px-2"
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleEditSave}
                        className="text-xs py-1 px-2"
                        disabled={!editText.trim()}
                      >
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-grow">{item.text}</div>
                    <div className="flex space-x-1">
                      {index > 0 && (
                        <Button
                          variant="secondary"
                          size="icon"
                          isRounded
                          onClick={() => handleMoveItem(item.id, 'up')}
                          aria-label="Déplacer vers le haut"
                          title="Déplacer vers le haut"
                          className="h-6 w-6"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                          </svg>
                        </Button>
                      )}
                      
                      {index < bulletItems.length - 1 && (
                        <Button
                          variant="secondary"
                          size="icon"
                          isRounded
                          onClick={() => handleMoveItem(item.id, 'down')}
                          aria-label="Déplacer vers le bas"
                          title="Déplacer vers le bas"
                          className="h-6 w-6"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </Button>
                      )}
                      
                      <Button
                        variant="warning"
                        size="icon"
                        isRounded
                        onClick={() => handleEditStart(item)}
                        aria-label="Modifier"
                        title="Modifier"
                        className="h-6 w-6"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="icon"
                        isRounded
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Supprimer"
                        title="Supprimer"
                        className="h-6 w-6"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 italic mb-3">
            Aucun élément dans la liste
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ajouter un nouvel élément..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <Button
            variant="primary"
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
          >
            Ajouter
          </Button>
        </div>
        
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CVFormInputBulletList;