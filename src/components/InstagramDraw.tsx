
import { useState } from 'react';
import { Instagram, Copy, Upload, Trash, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import ResultModal from '@/components/ResultModal';
import { exportToFile, getFormattedDate } from '@/lib/export-utils';

interface Comment {
  username: string;
  text: string;
}

const InstagramDraw = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [winners, setWinners] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [numWinners, setNumWinners] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [drawDate] = useState(new Date());
  
  const handleParseComments = () => {
    if (!commentText.trim()) {
      toast.error("Adicione comentários primeiro");
      return;
    }
    
    try {
      // Parse comments from textarea
      // Format expected: username: comment text
      const lines = commentText.trim().split(/\r?\n/);
      const parsedComments: Comment[] = [];
      
      for (const line of lines) {
        if (line.trim()) {
          // Check if line has format "username: comment"
          const match = line.match(/^([^:]+):\s*(.+)$/);
          
          if (match) {
            parsedComments.push({
              username: match[1].trim(),
              text: match[2].trim()
            });
          } else {
            // If no colon, assume it's just a username
            parsedComments.push({
              username: line.trim(),
              text: "Sem texto"
            });
          }
        }
      }
      
      setComments(parsedComments);
      
      if (parsedComments.length > 0) {
        toast.success(`${parsedComments.length} comentários adicionados`);
      } else {
        toast.error("Nenhum comentário válido encontrado");
      }
    } catch (error) {
      toast.error("Erro ao processar comentários", {
        description: "Verifique o formato e tente novamente"
      });
    }
  };
  
  const handleDraw = () => {
    if (comments.length === 0) {
      toast.error("Adicione comentários antes de realizar o sorteio");
      return;
    }
    
    if (numWinners <= 0 || numWinners > comments.length) {
      toast.error(`Escolha entre 1 e ${comments.length} ganhadores`);
      return;
    }
    
    // Shuffle comments using Fisher-Yates algorithm
    const shuffled = [...comments];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Select the first N comments as winners
    const selectedWinners = shuffled.slice(0, numWinners);
    setWinners(selectedWinners);
    setShowModal(true);
    
    toast.success(`${numWinners} ganhador${numWinners > 1 ? 'es' : ''} sorteado${numWinners > 1 ? 's' : ''}`);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCommentText(content);
      handleParseComments();
    };
    reader.readAsText(file);
  };
  
  const handleClearAll = () => {
    if (comments.length === 0) return;
    
    if (confirm("Tem certeza que deseja limpar todos os comentários?")) {
      setComments([]);
      setCommentText('');
      toast("Comentários limpos com sucesso");
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência");
  };
  
  const exportResult = () => {
    if (winners.length === 0) {
      toast.error("Realize um sorteio primeiro");
      return;
    }
    
    const content = 
      `RESULTADO DO SORTEIO DE COMENTÁRIOS DO INSTAGRAM\n` +
      `Data: ${drawDate.toLocaleDateString()}\n` +
      `Total de comentários: ${comments.length}\n` +
      `Número de ganhadores: ${winners.length}\n\n` +
      `GANHADORES:\n${winners.map((w, i) => `${i + 1}. @${w.username}: ${w.text}`).join('\n')}`;
    
    exportToFile(content, `sorteio_instagram_${getFormattedDate()}.txt`);
    
    toast.success("Resultado exportado com sucesso", {
      description: "O arquivo foi salvo no seu dispositivo"
    });
  };
  
  const getExportData = () => {
    return {
      content: 
        `RESULTADO DO SORTEIO DE COMENTÁRIOS DO INSTAGRAM\n` +
        `Data: ${drawDate.toLocaleDateString()}\n` +
        `Total de comentários: ${comments.length}\n` +
        `Número de ganhadores: ${winners.length}\n\n` +
        `GANHADORES:\n${winners.map((w, i) => `${i + 1}. @${w.username}: ${w.text}`).join('\n')}`,
      filename: "sorteio_instagram"
    };
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 rounded-xl">
        <div className="bg-white dark:bg-card rounded-[calc(0.75rem-1px)] p-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              Comentários do Instagram
            </h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Cole os comentários abaixo (um por linha)</label>
              <Textarea 
                placeholder="username1: texto do comentário&#10;username2: outro comentário&#10;..."
                className="min-h-[180px] font-mono text-sm"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="default" onClick={handleParseComments} className="gap-2">
                <Copy className="h-4 w-4" />
                Processar Comentários
              </Button>
              
              <div className="relative">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Carregar Arquivo
                </Button>
                <input
                  type="file"
                  accept=".txt,.csv,.json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Carregar arquivo de comentários"
                />
              </div>
              
              <Button variant="outline" className="gap-2" onClick={handleClearAll}>
                <Trash className="h-4 w-4" />
                Limpar Tudo
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl bg-white dark:bg-card shadow-md p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Configurar Sorteio</h3>
          <div className="bg-muted/50 px-3 py-1 rounded-full text-sm">
            {comments.length} comentários
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Número de ganhadores</label>
            <Input
              type="number"
              min="1"
              max={comments.length || 1}
              value={numWinners}
              onChange={(e) => setNumWinners(parseInt(e.target.value) || 1)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              className="w-full sm:w-auto gap-2" 
              size="lg" 
              disabled={comments.length === 0}
              onClick={handleDraw}
            >
              <Trophy className="h-4 w-4" />
              Realizar Sorteio
            </Button>
          </div>
        </div>
      </div>
      
      {/* Result Modal */}
      <ResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${winners.length} Ganhador${winners.length > 1 ? 'es' : ''} do Sorteio`}
        exportData={winners.length > 0 ? getExportData() : undefined}
      >
        <div className="space-y-4">
          {winners.map((winner, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border hover:shadow-sm transition-shadow"
            >
              <div className="flex-shrink-0 bg-gradient-to-br from-pink-500 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-lg truncate">@{winner.username}</div>
                <div className="text-sm text-muted-foreground truncate">{winner.text}</div>
              </div>
              <button 
                onClick={() => copyToClipboard(`@${winner.username}`)}
                className="p-2 hover:bg-muted rounded-full"
                title="Copiar nome de usuário"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          <div className="pt-2 text-center">
            <Button variant="outline" onClick={exportResult} className="gap-2">
              <Upload className="h-4 w-4" />
              Exportar Resultado
            </Button>
          </div>
        </div>
      </ResultModal>
    </div>
  );
};

export default InstagramDraw;
