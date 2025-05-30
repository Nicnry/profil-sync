import { useState } from 'react';
import Button from '@/components/ui/button';
import { Link } from '@/types/cv';
import { generateId } from '@/utils/helpers';

interface CVFormInputLinksProps {
  id: string;
  links?: Link[];
  onChange?: (links: Link[]) => void;
  onRemove?: () => void;
  error?: string;
}

const PLATFORM_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'other', label: 'Autre' }
];

const CVFormInputLinks = ({ 
  id, 
  links = [], 
  onChange,
  onRemove,
  error
}: CVFormInputLinksProps) => {
  const [linksList, setLinksList] = useState<Link[]>(links);
  const [platform, setPlatform] = useState<string>(PLATFORM_OPTIONS[0].value);
  const [url, setUrl] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  
  const handleAddLink = () => {
    if (!url.trim()) return;
    
    const newLink: Link = {
      id: generateId('link'),
      platform,
      url: url.trim(),
      label: label.trim() || undefined
    };
    
    const updatedLinks = [...linksList, newLink];
    setLinksList(updatedLinks);
    
    // Reset form
    setUrl('');
    setLabel('');
    
    if (onChange) {
      onChange(updatedLinks);
    }
  };
  
  const handleRemoveLink = (linkId: string) => {
    const updatedLinks = linksList.filter(link => link.id !== linkId);
    setLinksList(updatedLinks);
    
    if (onChange) {
      onChange(updatedLinks);
    }
  };
  
  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'linkedin':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'github':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.954 4.569a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.061a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.937 4.937 0 0 0 4.604 3.417 9.868 9.868 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 0 0 2.46-2.548l-.047-.02z" />
          </svg>
        );
      case 'portfolio':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  return (
    <div id={id} className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div className="font-medium text-orange-800">Liens</div>
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
        {linksList.length > 0 ? (
          <div className="mb-3 space-y-2">
            {linksList.map(link => (
              <div 
                key={link.id} 
                className="flex items-center justify-between p-2 bg-white rounded border border-orange-100"
              >
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">
                    {getPlatformIcon(link.platform)}
                  </span>
                  <span className="font-medium">{link.platform === 'other' && link.label ? link.label : PLATFORM_OPTIONS.find(p => p.value === link.platform)?.label}</span>
                  <span className="ml-2 text-xs text-gray-500 truncate max-w-xs">
                    {link.url}
                  </span>
                </div>
                <Button
                  variant="danger"
                  size="icon"
                  isRounded
                  onClick={() => handleRemoveLink(link.id)}
                  aria-label={`Supprimer ${link.platform}`}
                  title={`Supprimer ${link.platform}`}
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
            Aucun lien ajouté
          </div>
        )}
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORM_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {platform === 'other' && (
              <div>
                <input
                  type="text"
                  placeholder="Nom de la plateforme"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div>
            <input
              type="url"
              placeholder="URL (https://...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={handleAddLink}
              disabled={!url.trim() || (platform === 'other' && !label.trim())}
              className="w-full"
            >
              Ajouter le lien
            </Button>
          </div>
        </div>
        
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CVFormInputLinks;