
import { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { Upload, X, Play, Settings, RefreshCw } from 'lucide-react';
import ResultModal from './ResultModal';

interface RouletteProps {
  items: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
  onClearItems: () => void;
  onFileLoad: (items: string[]) => void;
  onWinner: (item: string) => void;
}

const Roulette = ({
  items,
  onAddItem,
  onRemoveItem,
  onClearItems,
  onFileLoad,
  onWinner
}: RouletteProps) => {
  const [newItem, setNewItem] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spinDuration, setSpinDuration] = useState(5);
  const [highlightWinner, setHighlightWinner] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Digite um item para adicionar");
      return;
    }
    
    onAddItem(newItem.trim());
    setNewItem('');
    toast.success("Item adicionado com sucesso");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const fileItems = content
        .split(/\r?\n/)
        .map(item => item.trim())
        .filter(item => item);
      
      if (fileItems.length) {
        onFileLoad(fileItems);
        toast.success(`${fileItems.length} itens carregados com sucesso`);
      } else {
        toast.error("Nenhum item encontrado no arquivo");
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const getItemColor = (index: number, isWinningIndex: boolean = false) => {
    // Alternating colors
    const baseColors = [
      { bg: 'bg-red-500', text: 'text-white' },
      { bg: 'bg-amber-400', text: 'text-gray-900' },
      { bg: 'bg-emerald-500', text: 'text-white' },
      { bg: 'bg-blue-500', text: 'text-white' },
      { bg: 'bg-purple-500', text: 'text-white' },
      { bg: 'bg-pink-500', text: 'text-white' },
    ];
    
    const colorIndex = index % baseColors.length;
    return baseColors[colorIndex];
  };

  const spinWheel = () => {
    if (items.length < 2) {
      toast.error("Adicione pelo menos 2 itens para girar a roleta");
      return;
    }
    
    setIsSpinning(true);
    setWinner(null);
    setHighlightWinner(false);
    
    // More randomness: between 5 and 10 full rotations + random offset
    const minRotation = (Math.floor(Math.random() * 5) + 5) * 360;
    const randomOffset = Math.floor(Math.random() * 360);
    const newRotation = rotation + minRotation + randomOffset;
    
    setRotation(newRotation);
    
    setTimeout(() => {
      const winnerIndex = determineWinner(newRotation);
      const winnerName = items[winnerIndex];
      
      setWinner(winnerName);
      onWinner(winnerName);
      setIsSpinning(false);
      
      // Small delay before showing result to let the wheel finish animating
      setTimeout(() => {
        setHighlightWinner(true);
        // Then small delay before showing full result modal
        setTimeout(() => {
          setShowResult(true);
        }, 1000);
      }, 500);
      
      toast.success("A roleta parou!");
    }, spinDuration * 1000);
  };
  
  const determineWinner = (finalRotation: number) => {
    if (items.length === 0) return -1;
    
    // Calculate the normalized rotation (0-360 degrees)
    const normalizedRotation = finalRotation % 360;
    
    // Calculate the size of each sector in the wheel
    const sectorSize = 360 / items.length;
    
    // Determine which sector the rotation points to
    // The wheel rotates clockwise, so we need to adjust the logic
    let winnerIndex = Math.floor(normalizedRotation / sectorSize);
    winnerIndex = (items.length - winnerIndex) % items.length;
    
    return winnerIndex;
  };
  
  const resetWheel = () => {
    setRotation(0);
    setWinner(null);
    setHighlightWinner(false);
  };

  // Mute colors when spinning
  const colorMultiplier = isSpinning ? 'opacity-80' : 'opacity-100';
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-card shadow-2xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold drop-shadow-md">Roleta de Sorteio</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {showSettings && (
          <div className="m-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg animate-fade-in border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium mb-3 text-purple-800 dark:text-purple-300">Configurações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duração da Rotação (segundos)</label>
                <input
                  type="number"
                  value={spinDuration}
                  onChange={(e) => setSpinDuration(Math.max(1, parseInt(e.target.value) || 5))}
                  className="form-input w-full rounded-lg border-purple-200 dark:border-purple-800 focus:ring-purple-500"
                  min="1"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Carregar Itens de Arquivo</label>
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt"
                    className="hidden"
                    id="wheel-file-upload"
                  />
                  <label
                    htmlFor="wheel-file-upload"
                    className="flex items-center justify-center px-4 py-2 border border-dashed border-purple-300 dark:border-purple-700 rounded-lg text-sm text-muted-foreground hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors cursor-pointer w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Selecionar arquivo .txt
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-white dark:bg-card rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-800 md:col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Adicionar Item</label>
              <div className="flex">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="form-input rounded-l-lg flex-grow border-gray-200 dark:border-gray-700"
                  placeholder="Digite um nome"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  disabled={isSpinning}
                />
                <button
                  onClick={handleAddItem}
                  disabled={isSpinning}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-r-lg disabled:opacity-50 font-medium"
                >
                  Adicionar
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Itens da Roleta ({items.length})</h3>
                {items.length > 0 && (
                  <button
                    onClick={onClearItems}
                    disabled={isSpinning}
                    className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50"
                  >
                    Limpar lista
                  </button>
                )}
              </div>
              
              <div className="border rounded-lg p-2 h-60 overflow-y-auto">
                {items.length > 0 ? (
                  <ul className="space-y-1">
                    {items.map((item, index) => {
                      const { bg, text } = getItemColor(index);
                      return (
                        <li key={index} className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${bg}`}></div>
                            <span>{item}</span>
                          </div>
                          <button
                            onClick={() => onRemoveItem(index)}
                            disabled={isSpinning}
                            className="text-destructive hover:text-destructive/80 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Nenhum item adicionado
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center md:col-span-2">
            <div className="relative bg-white dark:bg-card rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-800 w-full">
              {/* Fortune wheel container */}
              <div className="relative w-full mx-auto aspect-square max-w-96 mb-6"> 
                {/* Wheel indicator (pointer) */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -mt-6 z-20 drop-shadow-xl">
                  <div className="w-12 h-12 overflow-hidden">
                    <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[36px] border-l-transparent border-r-transparent border-t-amber-500 filter drop-shadow-lg mx-auto"></div>
                  </div>
                </div>
                
                {/* Center wheel cap */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full z-10 flex items-center justify-center shadow-inner">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-2 border-gray-500"></div>
                </div>
                
                {/* The wheel */}
                <div 
                  ref={wheelRef}
                  className="absolute inset-0 rounded-full overflow-hidden border-8 border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.3),inset_0_0_15px_rgba(0,0,0,0.3)] transition-all"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: `transform ${spinDuration}s cubic-bezier(0.2, 0.8, 0.3, 1)`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {items.length > 0 ? (
                    items.map((item, index) => {
                      const segmentAngle = 360 / items.length;
                      const rotation = index * segmentAngle;
                      const isWinningSegment = winner === item && highlightWinner;
                      const { bg, text } = getItemColor(index, isWinningSegment);
                      const segmentScale = isWinningSegment ? 'scale-[1.03]' : 'scale-100';
                      const segmentZIndex = isWinningSegment ? 'z-[5]' : 'z-[1]';
                      
                      return (
                        <div
                          key={index}
                          className={`absolute top-0 left-0 w-full h-full origin-center transition-transform ${segmentZIndex} ${segmentScale}`}
                          style={{
                            transform: `rotate(${rotation}deg)`,
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.sin((segmentAngle * Math.PI) / 180)}%, 50% 50%)`,
                            transition: 'all 0.3s ease-out',
                          }}
                        >
                          <div 
                            className={`w-full h-full flex items-start justify-center pt-6 md:pt-12 ${bg} ${text} ${colorMultiplier}`}
                            style={{
                              transform: `rotate(${segmentAngle / 2}deg)`,
                              transformOrigin: 'center',
                              transition: 'opacity 0.3s ease-out',
                              boxShadow: isWinningSegment ? 'inset 0 0 20px rgba(255,255,255,0.6)' : 'none',
                            }}
                          >
                            <span 
                              className={`max-w-[80%] text-center font-bold ${
                                isWinningSegment ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
                              }`}
                              style={{ 
                                transform: 'rotate(180deg)',
                                textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s ease-out',
                              }}
                            >
                              {item}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Adicione itens</p>
                    </div>
                  )}
                </div>
                
                {/* Wheel outer edge with gold pegs */}
                <div className="absolute inset-0 rounded-full pointer-events-none z-[2]">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-3 h-3 bg-amber-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md"
                      style={{
                        left: `${50 + 49 * Math.cos((i * 15 * Math.PI) / 180)}%`,
                        top: `${50 + 49 * Math.sin((i * 15 * Math.PI) / 180)}%`,
                        boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={spinWheel}
                disabled={isSpinning || items.length < 2}
                className="mt-4 px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-white font-bold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 w-full max-w-64 mx-auto flex items-center justify-center relative z-20"
              >
                {isSpinning ? (
                  <>
                    <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
                    Girando...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" fill="currentColor" />
                    Girar Roleta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Resultado da Roleta"
      >
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-4">O item sorteado foi:</p>
          {winner && (
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-scale-up">
              {winner}
            </div>
          )}
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => {
                resetWheel();
                setShowResult(false);
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reiniciar
            </button>
            
            <button
              onClick={() => {
                setShowResult(false);
                setTimeout(() => spinWheel(), 300);
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" fill="currentColor" />
              Girar Novamente
            </button>
          </div>
        </div>
      </ResultModal>
    </div>
  );
};

export default Roulette;
