import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Roulette from '@/components/Roulette';
import { exportToFile, getFormattedDate } from '@/lib/export-utils';

const RoulettePage = () => {
  const [items, setItems] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  
  useEffect(() => {
    // Welcome toast
    toast("Roleta de Sorteio", {
      description: "Adicione itens e gire a roleta para realizar um sorteio visual.",
      icon: "🎯"
    });
    
    // Default items
    setItems(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  }, []);
  
  const handleAddItem = (item: string) => {
    setItems([...items, item]);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const handleClearItems = () => {
    if (items.length > 0) {
      if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        setItems([]);
        toast("Lista limpa com sucesso");
      }
    }
  };
  
  const handleFileLoad = (fileItems: string[]) => {
    setItems(fileItems);
  };

  const handleWinner = (item: string) => {
    setWinner(item);
  };
  
  const exportResult = () => {
    if (!winner) {
      toast.error("Realize um sorteio primeiro");
      return;
    }

    const content = 
      `RESULTADO DO SORTEIO DA ROLETA\n` +
      `Data: ${new Date().toLocaleDateString()}\n` +
      `Total de itens na roleta: ${items.length}\n\n` +
      `Item sorteado: ${winner}`;

    exportToFile(content, `sorteio_roleta_${getFormattedDate()}.txt`);
    
    toast.success("Resultado exportado com sucesso", {
      description: "O arquivo foi salvo no seu dispositivo"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/20">
      <Header />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link 
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para Início
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl overflow-hidden"
          >
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-white/60 dark:bg-card/50 blur-xl rounded-3xl opacity-90"></div>
              <div className="p-6 md:p-8 relative z-10">
                <Roulette 
                  items={items}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  onClearItems={handleClearItems}
                  onFileLoad={handleFileLoad}
                  onWinner={handleWinner}
                />

                {winner && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={exportResult}
                      className="flex items-center justify-center px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-full shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Exportar Resultado
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sorteio Fácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default RoulettePage;
