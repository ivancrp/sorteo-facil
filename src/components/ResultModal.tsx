
import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportToFile, getFormattedDate } from '@/lib/export-utils';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  exportData?: {
    content: string;
    filename: string;
  };
}

const ResultModal = ({ isOpen, onClose, title, children, exportData }: ResultModalProps) => {
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setAnimationClass('animate-scale-up');
      
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setAnimationClass('animate-fade-out');
      
      // Unlock body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleExport = () => {
    if (exportData) {
      exportToFile(exportData.content, `${exportData.filename}_${getFormattedDate()}.txt`);
      toast.success("Resultado exportado com sucesso", {
        description: "O arquivo foi salvo no seu dispositivo"
      });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative bg-white dark:bg-card rounded-xl shadow-2xl w-full max-w-lg ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center space-x-2">
            {exportData && (
              <button 
                onClick={handleExport}
                className="p-1 rounded-full hover:bg-secondary transition-colors text-primary"
                title="Exportar resultado"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
