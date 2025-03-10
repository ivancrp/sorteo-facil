import { useState, useRef, ChangeEvent } from 'react';
import { toast } from "sonner";
import { List, Upload, RefreshCw, Shuffle } from 'lucide-react';
import ResultModal from './ResultModal';

const NameDraw = () => {
  const [names, setNames] = useState<string[]>([]);
  const [inputName, setInputName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const addName = () => {
    if (!inputName.trim()) {
      toast.error("Digite um nome para adicionar");
      return;
    }
    
    setNames([...names, inputName.trim()]);
    setInputName('');
    toast.success("Nome adicionado com sucesso");
  };
  
  const removeName = (index: number) => {
    const newNames = [...names];
    newNames.splice(index, 1);
    setNames(newNames);
    toast("Nome removido", { description: "Lista atualizada" });
  };
  
  const loadNamesFromFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const fileNames = content
        .split(/\r?\n/)
        .map(name => name.trim())
        .filter(name => name);
      
      if (fileNames.length) {
        setNames(fileNames);
        toast.success(`${fileNames.length} nomes carregados com sucesso`);
      } else {
        toast.error("Nenhum nome encontrado no arquivo");
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const draw = () => {
    if (names.length === 0) {
      toast.error("Adicione pelo menos um nome para realizar o sorteio");
      return;
    }
    
    if (quantity < 1) {
      toast.error("A quantidade deve ser pelo menos 1");
      return;
    }
    
    if (quantity > names.length) {
      toast.error("A quantidade não pode ser maior que o número de nomes na lista");
      return;
    }
    
    setIsDrawing(true);
    
    // Create a copy to avoid modifying the original array
    const namesCopy = [...names];
    const selectedNames: string[] = [];
    
    // Simulate drawing animation
    setTimeout(() => {
      // Fisher-Yates shuffle algorithm
      for (let i = namesCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [namesCopy[i], namesCopy[j]] = [namesCopy[j], namesCopy[i]];
      }
      
      // Take the first 'quantity' names
      for (let i = 0; i < quantity; i++) {
        selectedNames.push(namesCopy[i]);
      }
      
      setResult(selectedNames);
      setIsDrawing(false);
      setShowResult(true);
      
      toast.success("Sorteio concluído com sucesso!");
    }, 1500);
  };
  
  const getExportContent = () => {
    if (result.length === 0) return "";
    
    const header = `RESULTADO DO SORTEIO DE NOMES\n` +
                  `Data: ${new Date().toLocaleDateString()}\n` +
                  `Total de nomes na lista: ${names.length}\n` +
                  `Quantidade sorteada: ${result.length}\n\n`;
                  
    const namesList = result.length === 1 
      ? `Nome sorteado: ${result[0]}`
      : `Nomes sorteados:\n${result.join('\n')}`;
    
    return header + namesList;
  };
  
  const getExportData = () => {
    return {
      content: getExportContent(),
      filename: 'sorteio_nomes'
    };
  };
  
  const clearNames = () => {
    if (names.length > 0) {
      if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        setNames([]);
        toast("Lista limpa com sucesso");
      }
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-card shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Sorteio de Nomes</h2>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Adicionar Nome</label>
            <div className="flex">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="form-input rounded-r-none flex-grow"
                placeholder="Digite um nome"
                onKeyDown={(e) => e.key === 'Enter' && addName()}
              />
              <button
                onClick={addName}
                className="px-4 py-2 bg-primary text-white rounded-r-lg"
              >
                Adicionar
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Ou Carregue de um Arquivo</label>
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={loadNamesFromFile}
                  accept=".txt"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar arquivo .txt
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Quantidade a Sortear</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="form-input"
                min="1"
                max={names.length}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Lista de Nomes ({names.length})</h3>
              {names.length > 0 && (
                <button
                  onClick={clearNames}
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  Limpar lista
                </button>
              )}
            </div>
            
            <div className="border rounded-lg p-2 h-48 overflow-y-auto">
              {names.length > 0 ? (
                <ul className="space-y-1">
                  {names.map((name, index) => (
                    <li key={index} className="flex items-center justify-between px-2 py-1 hover:bg-secondary/50 rounded">
                      <span>{name}</span>
                      <button
                        onClick={() => removeName(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Nenhum nome adicionado
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={draw}
          disabled={isDrawing || names.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isDrawing ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Sorteando...
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5 mr-2" />
              Realizar Sorteio
            </>
          )}
        </button>
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
              <p className="text-sm text-muted-foreground mb-4">O nome sorteado foi:</p>
              <div className="text-3xl font-semibold text-primary">{result[0]}</div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">Os nomes sorteados foram:</p>
              <ul className="space-y-2 my-4">
                {result.map((name, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                  >
                    {name}
                  </li>
                ))}
              </ul>
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

export default NameDraw;
