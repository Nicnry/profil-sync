'use client';

import { useState, useEffect, useRef } from 'react';
import { ComponentType, ComponentInfo, NestedBlockInfo } from '@/components/componentTypes';
import CVFormInputTitle from '@/components/cvFormInputTitle';
import CVFormInputDateRange from '@/components/cvFormInputDateRange';

interface CVFormColumnBlockProps {
  id: string;
  title: string;
  onTitleChange: (id: string, newTitle: string) => void;
  onRemove?: () => void;
  componentChildren?: NestedBlockInfo[];
  components?: ComponentInfo[];
  onAddChild?: (parentId: string) => void;
  onRemoveChild?: (parentId: string, childId: string) => void;
  onChildTitleChange?: (parentId: string, childId: string, newTitle: string) => void;
  onAddComponent?: (blockId: string, componentType: ComponentType) => void;
  onRemoveComponent?: (blockId: string, componentId: string) => void;
  onUpdateComponentProps?: (blockId: string, componentId: string, newProps: Record<string, string>) => void;
  depth?: number;
}

interface ComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (componentType: ComponentType) => void;
}

const ComponentSelectionModal = ({ isOpen, onClose, onSelectComponent }: ComponentModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const componentOptions = [
    { id: 'title', type: ComponentType.INPUT_TITLE, name: 'Titre' },
    { id: 'from', type: ComponentType.INPUT_FROM, name: 'De / À' }
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-gray-200 bg-opacity-30 z-50 flex items-center justify-center">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-[95%] h-[90vh] overflow-y-auto shadow-lg border border-gray-200"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">Blocs disponibles</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-2">
            {componentOptions.map((option) => (
              <div 
                key={option.id}
                onClick={() => {
                  onSelectComponent(option.type);
                  onClose();
                }}
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
        </div>
      </div>
    </div>
  );
};

const CVFormColumnBlock = ({ 
  id, 
  title, 
  onTitleChange, 
  onRemove,
  componentChildren = [],
  components = [],
  onAddChild,
  onRemoveChild,
  onChildTitleChange,
  onAddComponent,
  onRemoveComponent,
  onUpdateComponentProps,
  depth = 0
}: CVFormColumnBlockProps) => {
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
      onTitleChange(id, blockTitle);
    }
  }, [blockTitle, id, onTitleChange]);

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
      onTitleChange(id, defaultTitle);
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
    if (onAddChild) {
      onAddChild(id);
      if (!isExpanded) {
        setIsExpanded(true);
      }
    }
  };
  
  const handleAddComponent = (componentType: ComponentType) => {
    if (onAddComponent) {
      onAddComponent(id, componentType);
      if (!isExpanded) {
        setIsExpanded(true);
      }
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
              if (onUpdateComponentProps) {
                onUpdateComponentProps(id, component.id, { defaultValue: value });
              }
            }}
            onRemove={() => onRemoveComponent && onRemoveComponent(id, component.id)}
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
              if (onUpdateComponentProps) {
                onUpdateComponentProps(id, component.id, { from, to });
              }
            }}
            onRemove={() => onRemoveComponent && onRemoveComponent(id, component.id)}
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
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
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
          </button>
          
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700"
              aria-label="Supprimer ce bloc"
              title="Supprimer ce bloc"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          )}
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
                  onTitleChange={(childId, newTitle) => {
                    if (onChildTitleChange) {
                      onChildTitleChange(id, childId, newTitle);
                    }
                  }}
                  onRemove={() => onRemoveChild && onRemoveChild(id, child.id)}
                  onAddChild={onAddChild}
                  onRemoveChild={onRemoveChild}
                  onChildTitleChange={onChildTitleChange}
                  onAddComponent={onAddComponent}
                  onRemoveComponent={onRemoveComponent}
                  onUpdateComponentProps={onUpdateComponentProps}
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
            {onAddComponent && (
              <button
                type="button"
                onClick={() => setShowComponentModal(true)}
                className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                aria-label="Ajouter un champ"
                title="Ajouter un champ"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            )}
            
            {onAddChild && depth < 1 && (
              <button
                type="button"
                onClick={handleAddChild}
                className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Ajouter un sous-bloc"
                title="Ajouter un sous-bloc"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      <ComponentSelectionModal 
        isOpen={showComponentModal}
        onClose={() => setShowComponentModal(false)}
        onSelectComponent={handleAddComponent}
      />
    </div>
  );
};

export default CVFormColumnBlock;