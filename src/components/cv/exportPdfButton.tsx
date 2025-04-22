'use client';

import Button from '@/components/ui/button';
import { useCV } from '@/context/cvContext';
import { generateAndDownloadPDF } from '@/utils/pdfGenerator';

interface ExportPdfButtonProps {
  className?: string;
}

const ExportPdfButton = ({ className = '' }: ExportPdfButtonProps) => {
  const { blocks, rowsConfig } = useCV();
  
  const handleExportPdf = async () => {
    try {
      await generateAndDownloadPDF(blocks, rowsConfig);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez vérifier la console pour plus de détails.');
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className={`w-full mt-3 bg-green-600 hover:bg-green-700 text-white ${className}`}
      onClick={handleExportPdf}
      disabled={blocks.length === 0}
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      Exporter en PDF
    </Button>
  );
};

export default ExportPdfButton;