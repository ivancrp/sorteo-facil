
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Roulette from '@/components/Roulette';

const RoulettePage = () => {
  const [items, setItems] = useState<string[]>([]);
  
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
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
          >
            <Roulette 
              items={items}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onClearItems={handleClearItems}
              onFileLoad={handleFileLoad}
            />
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
