
import { useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import InstagramDraw from '@/components/InstagramDraw';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const InstagramDrawPage = () => {
  useEffect(() => {
    // Welcome toast
    toast("Sorteio de Comentários do Instagram", {
      description: "Sorteie vencedores a partir de comentários do Instagram.",
      icon: "📱"
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-indigo-100 dark:from-pink-950/20 dark:to-indigo-950/10">
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
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Alert variant="default" className="border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-700 dark:text-blue-400">Aviso</AlertTitle>
              <AlertDescription className="text-blue-600/90 dark:text-blue-300/90">
                Estamos trabalhando para implementar esta funcionalidade de integração com o Instagram. 
                Por enquanto, você pode adicionar comentários manualmente.
              </AlertDescription>
            </Alert>
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
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">Sorteio de Comentários do Instagram</h1>
                  <p className="text-muted-foreground">
                    Escolha vencedores aleatórios a partir de comentários do Instagram. Cole os comentários, configure o sorteio e escolha os ganhadores.
                  </p>
                </div>
                
                <InstagramDraw />
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

export default InstagramDrawPage;
