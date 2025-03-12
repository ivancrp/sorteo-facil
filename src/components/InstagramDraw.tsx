
import { useState } from 'react';
import { Instagram, Copy, Upload, Trash, Trophy, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import ResultModal from '@/components/ResultModal';
import { exportToFile, getFormattedDate } from '@/lib/export-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Comment {
  username: string;
  text: string;
}

const InstagramDraw = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [winners, setWinners] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchInstagramComments = async () => {
    if (!postUrl.trim()) {
      toast.error("Insira a URL do post do Instagram");
      return;
    }

    setIsLoading(true);

    try {
      // Extract post ID from URL
      const urlRegex = /instagram\.com\/p\/([^\/]+)/;
      const match = postUrl.match(urlRegex);
      
      if (!match) {
        toast.error("URL do Instagram inválida", {
          description: "Formato esperado: https://www.instagram.com/p/CODE"
        });
        setIsLoading(false);
        return;
      }

      // In a real implementation, this would call an API to fetch comments
      // For demonstration, we'll simulate fetching with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, this would come from the Instagram API
      const mockComments: Comment[] = [
        { username: "usuario_demo1", text: "Adorei esse sorteio!" },
        { username: "maria_silva", text: "Quero ganhar! 😍" },
        { username: "joao.gamer", text: "Participando! #sorteio" },
        { username: "ana_beatriz", text: "Já estou seguindo" },
        { username: "carlos_oficial", text: "Post incrível" },
        { username: "lucia.123", text: "Quero muito ganhar" },
        { username: "pedro.design", text: "Estou marcando três amigos" },
        { username: "julia_castro", text: "Adoro seus conteúdos" },
        { username: "rafael.tech", text: "Participando do sorteio!" },
        { username: "camila_90", text: "Quero muito esse prêmio!" }
      ];
      
      setComments(mockComments);
      
      // Generate the comment text for the textarea
      const commentTextContent = mockComments
        .map(comment => `${comment.username}: ${comment.text}`)
        .join('\n');
      
      setCommentText(commentTextContent);
      
      toast.success("Comentários importados com sucesso", {
        description: `${mockComments.length} comentários carregados`
      });
    } catch (error) {
      toast.error("Erro ao importar comentários", {
        description: "Não foi possível conectar ao Instagram. Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
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
      setPostUrl('');
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
            
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="manual">Inserir Manualmente</TabsTrigger>
                <TabsTrigger value="import">Importar do Instagram</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Cole os comentários abaixo (um por linha)</label>
                  <Textarea 
                    placeholder="username1: texto do comentário&#10;username2: outro comentário&#10;..."
                    className="min-h-[180px] font-mono text-sm"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
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
                </div>
              </TabsContent>
              
              <TabsContent value="import">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL do Post no Instagram</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://www.instagram.com/p/CODE"
                        value={postUrl}
                        onChange={(e) => setPostUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={fetchInstagramComments} 
                        disabled={isLoading}
                        className="gap-2 min-w-[140px]"
                      >
                        {isLoading ? "Importando..." : "Importar"}
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cole a URL completa de um post público do Instagram
                    </p>
                  </div>
                  
                  {commentText && (
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-sm font-medium">Comentários Importados</label>
                      <Textarea 
                        className="min-h-[150px] font-mono text-sm"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-wrap gap-3 mt-2">
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

