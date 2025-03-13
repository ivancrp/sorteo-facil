
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hash, List, Users, Circle, Instagram } from 'lucide-react';
import DrawCard from '@/components/DrawCard';
import Header from '@/components/Header';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const drawTypes = [
    {
      title: 'Sorteio de Números',
      description: 'Sorteie números aleatórios com intervalo personalizado.',
      href: '/sorteio/numeros',
      icon: Hash,
      color: 'primary'
    },
    {
      title: 'Sorteio de Nomes',
      description: 'Sorteie nomes de uma lista ou arquivo de texto.',
      href: '/sorteio/nomes',
      icon: List,
      color: 'secondary'
    },
    {
      title: 'Sorteio de Equipes',
      description: 'Forme equipes aleatórias a partir de uma lista de participantes.',
      href: '/sorteio/equipes',
      icon: Users,
      color: 'accent'
    },
    {
      title: 'Roleta de Sorteio',
      description: 'Realize sorteios com uma roleta visual e personalizada.',
      href: '/sorteio/roleta',
      icon: Circle,
      color: '#ffff7a'
    },
    {
      title: 'Sorteio de Comentários do Instagram',
      description: 'Sorteie vencedores a partir de comentários do Instagram.',
      href: '/sorteio/instagram',
      icon: Instagram,
      color: 'destructive'
    }
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center px-6 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl w-full text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Rápido, Fácil e Prático
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Realizando Sorteios com Facilidade
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa para realizar sorteios de números, nomes, equipes ou com roleta personalizada.
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
        >
          {drawTypes.map((drawType, index) => (
            <motion.div key={drawType.title} variants={item}>
              <DrawCard {...drawType} />
            </motion.div>
          ))}
        </motion.div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sorteio Fácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
