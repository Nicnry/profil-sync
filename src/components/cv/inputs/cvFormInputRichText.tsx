import { useState } from 'react';
import Button from '@/components/ui/button';

interface CVFormInputRichTextProps {
  id: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  error?: string;
}

const CVFormInputRichText = ({ 
  id, 
  defaultValue = "", 
  onChange,
  onRemove,
  error
}: CVFormInputRichTextProps) => {
  const [text, setText] = useState(defaultValue);
  const textareaId = `${id}-textarea`;
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleFormatClick = (format: 'bold' | 'italic' | 'underline' | 'bullet') => {
    // TODO : Slate.js ?
    let newText = text;
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    switch (format) {
      case 'bold':
        newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
        break;
      case 'italic':
        newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
        break;
      case 'underline':
        newText = text.substring(0, start) + `_${selectedText}_` + text.substring(end);
        break;
      case 'bullet':
        const lines = selectedText.split('\n');
        const bulletedLines = lines.map(line => `• ${line}`);
        newText = text.substring(0, start) + bulletedLines.join('\n') + text.substring(end);
        break;
    }
    
    setText(newText);
    if (onChange) {
      onChange(newText);
    }
  };

  return (
    <div id={id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <label htmlFor={textareaId} className="font-medium text-blue-800">Description / Texte riche</label>
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
      
      <div className="flex space-x-1 my-2 border-b border-blue-200 pb-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleFormatClick('bold')}
          title="Gras"
          aria-label="Mettre en gras"
        >
          <span className="font-bold">G</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleFormatClick('italic')}
          title="Italique"
          aria-label="Mettre en italique"
        >
          <span className="italic">I</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleFormatClick('underline')}
          title="Souligné"
          aria-label="Souligner"
        >
          <span className="underline">S</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleFormatClick('bullet')}
          title="Liste à puces"
          aria-label="Ajouter une liste à puces"
        >
          <span>•</span>
        </Button>
      </div>
      
      <div className="mt-2">
        <textarea
          id={textareaId}
          placeholder="Entrez votre description..."
          className={`w-full px-3 py-2 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-md focus:outline-none focus:ring-2 min-h-32`}
          value={text}
          onChange={handleChange}
        />
        <p className="mt-1 text-xs text-gray-500">
          Astuce: Utilisez les boutons au-dessus pour formater votre texte ou tapez directement **gras**, *italique*, ou _souligné_.
        </p>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CVFormInputRichText;