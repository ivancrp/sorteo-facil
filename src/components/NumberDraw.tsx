
import { useState } from 'react';
import { toast } from "sonner";
import { Dices, RefreshCw } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import ResultModal from './ResultModal';

const NumberDraw = () => {
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [result, setResult] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const validateInputs = () => {
    if (minNumber >= maxNumber) {
      toast.error("O número mínimo deve ser menor que o máximo");
      return false;
    }
    
    if (quantity < 1) {
      toast.error("A quantidade deve ser pelo menos 1");
      return false;
    }
    
    if (!allowRepeats && (maxNumber - minNumber + 1) < quantity) {
      toast.error("Não há números suficientes no intervalo para sortear sem repetição");
      return false;
    }
    
    return true;
  };
  
  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const draw = () => {
    if (!validateInputs()) return;
    
    setIsDrawing(true);
    const tempResults: number[] = [];
    
    // Simulate drawing animation
    let drawingTime = 1500;
    
    // First show some random numbers quickly changing
    const interval = setInterval(() => {
      let randomNum = generateRandomNumber(minNumber, maxNumber);
      setResult([randomNum]);
    }, 100);
    
    // Then after a delay, show the actual results
    setTimeout(() => {
      clearInterval(interval);
      
      if (allowRepeats) {
        for (let i = 0; i < quantity; i++) {
          tempResults.push(generateRandomNumber(minNumber, maxNumber));
        }
      } else {
        const availableNumbers = Array.from(
          { length: maxNumber - minNumber + 1 },
          (_, i) => i + minNumber
        );
        
        for (let i = 0; i < quantity; i++) {
          const randomIndex = Math.floor(Math.random() * availableNumbers.length);
          tempResults.push(availableNumbers.splice(randomIndex, 1)[0]);
        }
      }
      
      setResult(tempResults);
      setIsDrawing(false);
      setShowResult(true);
      
      toast.success(`Sorteio concluído com sucesso!`);
    }, drawingTime);
  };
  
  const getExportContent = () => {
    if (result.length === 0) return "";
    
    const header = `RESULTADO DO SORTEIO DE NÚMEROS\n` +
                  `Data: ${new Date().toLocaleDateString()}\n` +
                  `Intervalo: ${minNumber} a ${maxNumber}\n` +
                  `Quantidade: ${result.length}\n\n`;
                  
    const numbers = result.length === 1 
      ? `Número sorteado: ${result[0]}`
      : `Números sorteados:\n${result.join(', ')}`;
    
    return header + numbers;
  };
  
  const getExportData = () => {
    return {
      content: getExportContent(),
      filename: 'sorteio_numeros'
    };
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-card shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Sorteio de Números</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Número Mínimo</label>
            <input
              type="number"
              value={minNumber}
              onChange={(e) => setMinNumber(parseInt(e.target.value) || 0)}
              className="form-input"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Número Máximo</label>
            <input
              type="number"
              value={maxNumber}
              onChange={(e) => setMaxNumber(parseInt(e.target.value) || 0)}
              className="form-input"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Quantidade de Números</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="form-input"
              min="1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowRepeats"
              checked={allowRepeats}
              onChange={(e) => setAllowRepeats(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="allowRepeats" className="text-sm font-medium">
              Permitir números repetidos
            </label>
          </div>
        </div>
        
        <button
          onClick={draw}
          disabled={isDrawing}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isDrawing ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Sorteando...
            </>
          ) : (
            <>
              <Dices className="w-5 h-5 mr-2" />
              Realizar Sorteio
            </>
          )}
        </button>
        
        {isDrawing && (
          <div className="mt-10 flex flex-col items-center">
            <AnimatedNumber value={result[0] || 0} size="xl" />
          </div>
        )}
      </div>
      
      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Resultado do Sorteio"
        exportData={result.length > 0 ? getExportData() : undefined}
      >
        <div className="text-center">
          {result.length === 1 ? (
            <div className="py-8">
              <p className="text-sm text-muted-foreground mb-4">O número sorteado foi:</p>
              <div className="text-7xl font-bold text-primary">{result[0]}</div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">Os números sorteados foram:</p>
              <div className="flex flex-wrap justify-center gap-3 my-4">
                {result.map((num, index) => (
                  <div 
                    key={index} 
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => draw()}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sortear Novamente
          </button>
        </div>
      </ResultModal>
    </div>
  );
};

export default NumberDraw;
