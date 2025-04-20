'use client';

import { useState, useEffect, useRef } from 'react';
import { ComponentType, ComponentInfo, NestedBlockInfo } from '@/types/cv';
import CVFormInputTitle from '@/components/cv/inputs/cvFormInputTitle';
import CVFormInputDateRange from '@/components/cv/inputs/cvFormInputDateRange';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { useCV } from '@/context/cvContext';

interface CVFormColumnBlockProps {
  id: string;
  title: string;
  componentChildren?: NestedBlockInfo[];
  components?: ComponentInfo[];
  depth?: number;
}

interface ComponentSelectionProps {
  onSelectComponent: (componentType: ComponentType) => void;
}

const ComponentSelectionContent = ({ onSelectComponent }: ComponentSelectionProps) => {
  const componentOptions = [
    { id: 'title', type: ComponentType.INPUT_TITLE, name: 'Titre' },
    { id: 'from', type: ComponentType.INPUT_FROM, name: 'De / À' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-2">
      {componentOptions.map((option) => (
        <div 
          key={option.id}
          onClick={() => onSelectComponent(option.type)}
          className="border border-gray-200 rounded-md p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors flex flex-col items-center text-center"
        >
          <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mb-2">
            {option.type === ComponentType.INPUT_TITLE ? (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            )}
          </div>
          <h3 className="font-medium text-sm text-gray-800">{option.name}</h3>
        </div>
      ))}
    </div>
  );
};

const CVFormColumnBlock = ({ 
  id, 
  title, 
  componentChildren = [],
  components = [],
  depth = 0
}: CVFormColumnBlockProps) => {
  const {
    updateBlockTitle,
    removeBlock,
    addNestedBlock,
    addComponent,
    removeComponent,
    updateComponentProps
  } = useCV();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [blockTitle, setBlockTitle] = useState<string>(title);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showComponentModal, setShowComponentModal] = useState<boolean>(false);
  
  const isInitialMount = useRef(true);
  const prevTitle = useRef(title);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (prevTitle.current !== title) {
      setBlockTitle(title);
      prevTitle.current = title;
    }
  }, [title]);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (prevTitle.current !== blockTitle) {
      prevTitle.current = blockTitle;
      updateBlockTitle(id, blockTitle);
    }
  }, [blockTitle, id, updateBlockTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditEnd = () => {
    setIsEditing(false);
    if (!blockTitle.trim()) {
      const defaultTitle = 'Sans titre';
      setBlockTitle(defaultTitle);
      updateBlockTitle(id, defaultTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditEnd();
    } else if (e.key === 'Escape') {
      setBlockTitle(prevTitle.current);
      setIsEditing(false);
    }
  };
  
  const handleAddChild = () => {
    addNestedBlock(id);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };
  
  const handleAddComponent = (componentType: ComponentType) => {
    addComponent(id, componentType);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const getDepthClasses = () => {
    const borderClasses = depth === 0 
      ? 'border-gray-300' 
      : depth === 1 
        ? 'border-blue-200' 
        : 'border-green-200';
    
    const bgClasses = depth === 0 
      ? 'bg-gray-100' 
      : depth === 1 
        ? 'bg-blue-50' 
        : 'bg-green-50';
    
    return { borderClasses, bgClasses };
  };
  
  const { borderClasses, bgClasses } = getDepthClasses();
  
  const renderComponent = (component: ComponentInfo) => {
    switch(component.type) {
      case ComponentType.INPUT_TITLE:
        return (
          <CVFormInputTitle 
            key={component.id} 
            id={component.id} 
            defaultValue={component.props?.defaultValue || ""}
            onChange={(value) => {
              updateComponentProps(id, component.id, { defaultValue: value });
            }}
            onRemove={() => removeComponent(id, component.id)}
            error={component.errors?.title}
          />
        );
      case ComponentType.INPUT_FROM:
        return (
          <CVFormInputDateRange 
            key={component.id} 
            id={component.id} 
            fromValue={component.props?.from || ""}
            toValue={component.props?.to || ""}
            onChange={({ from, to }) => {
              updateComponentProps(id, component.id, { from, to });
            }}
            onRemove={() => removeComponent(id, component.id)}
            errors={{
              from: component.errors?.from,
              to: component.errors?.to
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border ${borderClasses} rounded-lg overflow-hidden mb-3`}>
      <div className={`${bgClasses} px-4 py-2 flex justify-between items-center`}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={blockTitle}
            onChange={(e) => setBlockTitle(e.target.value)}
            onBlur={handleEditEnd}
            onKeyDown={handleKeyDown}
            className="font-medium text-gray-800 bg-white border border-blue-400 rounded px-2 py-1 w-full mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h3 
            className="font-medium text-gray-800 cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditing(true)}
            title="Cliquez pour modifier le titre"
          >
            {blockTitle || 'Sans titre'}
          </h3>
        )}
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            isRounded
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Réduire" : "Développer"}
            title={isExpanded ? "Réduire" : "Développer"}
          >
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </Button>
          
          <Button
            variant="danger"
            size="icon"
            isRounded
            onClick={() => removeBlock(id)}
            aria-label="Supprimer ce bloc"
            title="Supprimer ce bloc"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          {components.length > 0 && (
            <div className="mb-4">
              {components.map(component => renderComponent(component))}
            </div>
          )}
          
          {componentChildren.length > 0 ? (
            <div className="pl-4 border-l-2 border-gray-200">
              {componentChildren.map(child => (
                <CVFormColumnBlock
                  key={child.id}
                  id={child.id}
                  title={child.title}
                  componentChildren={child.children}
                  components={child.components}
                  depth={depth + 1}
                />
              ))}
            </div>
          ) : depth === 1 ? (
            <div className="text-gray-400 text-sm italic">
              Aucun sous-bloc dans ce bloc
            </div>
          ) : null}
          
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              variant="warning"
              size="icon"
              isRounded
              onClick={() => setShowComponentModal(true)}
              aria-label="Ajouter un champ"
              title="Ajouter un champ"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </Button>
            
            {depth < 1 && (
              <Button
                variant="primary"
                size="icon"
                isRounded
                onClick={handleAddChild}
                aria-label="Ajouter un sous-bloc"
                title="Ajouter un sous-bloc"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </Button>
            )}
          </div>
        </div>
      )}
      
      <Modal 
        isOpen={showComponentModal}
        onClose={() => setShowComponentModal(false)}
        title="Composants disponibles"
        size="full"
      >
        <ComponentSelectionContent onSelectComponent={(type) => {
          handleAddComponent(type);
          setShowComponentModal(false);
        }} />
      </Modal>
    </div>
  );
};

export default CVFormColumnBlock;