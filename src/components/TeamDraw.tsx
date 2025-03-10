import { useState, useRef, ChangeEvent } from 'react';
import { toast } from "sonner";
import { Users, RefreshCw, Upload, Shuffle } from 'lucide-react';
import ResultModal from './ResultModal';

interface Team {
  name: string;
  members: string[];
}

const TeamDraw = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputName, setInputName] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const addParticipant = () => {
    if (!inputName.trim()) {
      toast.error("Digite um nome para adicionar");
      return;
    }
    
    setParticipants([...participants, inputName.trim()]);
    setInputName('');
    toast.success("Participante adicionado com sucesso");
  };
  
  const removeParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    toast("Participante removido", { description: "Lista atualizada" });
  };
  
  const loadParticipantsFromFile = (e: ChangeEvent<HTMLInputElement>) => {
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
        setParticipants(fileNames);
        toast.success(`${fileNames.length} participantes carregados com sucesso`);
      } else {
        toast.error("Nenhum participante encontrado no arquivo");
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const drawTeams = () => {
    if (participants.length < teamCount) {
      toast.error("O número de participantes deve ser maior ou igual ao número de equipes");
      return;
    }
    
    if (teamCount < 2) {
      toast.error("Defina pelo menos 2 equipes");
      return;
    }
    
    setIsDrawing(true);
    
    // Create a copy to avoid modifying the original array
    const shuffledParticipants = [...participants];
    
    // Simulate drawing animation
    setTimeout(() => {
      // Fisher-Yates shuffle algorithm
      for (let i = shuffledParticipants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledParticipants[i], shuffledParticipants[j]] = 
          [shuffledParticipants[j], shuffledParticipants[i]];
      }
      
      // Create teams
      const result: Team[] = Array(teamCount)
        .fill(0)
        .map((_, index) => ({
          name: `Equipe ${index + 1}`,
          members: []
        }));
      
      // Distribute participants as evenly as possible
      shuffledParticipants.forEach((participant, index) => {
        const teamIndex = index % teamCount;
        result[teamIndex].members.push(participant);
      });
      
      setTeams(result);
      setIsDrawing(false);
      setShowResult(true);
      
      toast.success("Equipes formadas com sucesso!");
    }, 1500);
  };
  
  const getExportContent = () => {
    if (teams.length === 0) return "";
    
    const header = `RESULTADO DO SORTEIO DE EQUIPES\n` +
                  `Data: ${new Date().toLocaleDateString()}\n` +
                  `Total de participantes: ${participants.length}\n` +
                  `Número de equipes: ${teams.length}\n\n`;
                  
    let teamsText = "EQUIPES FORMADAS:\n";
    teams.forEach((team, index) => {
      teamsText += `\n${team.name} (${team.members.length} ${team.members.length === 1 ? 'membro' : 'membros'}):\n`;
      team.members.forEach((member, memberIndex) => {
        teamsText += `  ${memberIndex + 1}. ${member}\n`;
      });
    });
    
    return header + teamsText;
  };
  
  const getExportData = () => {
    return {
      content: getExportContent(),
      filename: 'sorteio_equipes'
    };
  };
  
  const clearParticipants = () => {
    if (participants.length > 0) {
      if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        setParticipants([]);
        toast("Lista limpa com sucesso");
      }
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-card shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Sorteio de Equipes</h2>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Adicionar Participante</label>
            <div className="flex">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="form-input rounded-r-none flex-grow"
                placeholder="Digite um nome"
                onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
              />
              <button
                onClick={addParticipant}
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
                  onChange={loadParticipantsFromFile}
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
              <label className="block text-sm font-medium mb-2">Número de Equipes</label>
              <input
                type="number"
                value={teamCount}
                onChange={(e) => setTeamCount(parseInt(e.target.value) || 2)}
                className="form-input"
                min="2"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Lista de Participantes ({participants.length})</h3>
              {participants.length > 0 && (
                <button
                  onClick={clearParticipants}
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  Limpar lista
                </button>
              )}
            </div>
            
            <div className="border rounded-lg p-2 h-48 overflow-y-auto">
              {participants.length > 0 ? (
                <ul className="space-y-1">
                  {participants.map((participant, index) => (
                    <li key={index} className="flex items-center justify-between px-2 py-1 hover:bg-secondary/50 rounded">
                      <span>{participant}</span>
                      <button
                        onClick={() => removeParticipant(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Nenhum participante adicionado
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={drawTeams}
          disabled={isDrawing || participants.length < teamCount}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {isDrawing ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Formando Equipes...
            </>
          ) : (
            <>
              <Users className="w-5 h-5 mr-2" />
              Formar Equipes
            </>
          )}
        </button>
      </div>
      
      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Equipes Formadas"
        exportData={teams.length > 0 ? getExportData() : undefined}
      >
        <div>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {teams.length} equipes formadas com {participants.length} participantes
          </p>
          
          <div className="space-y-4 my-4 max-h-60 overflow-y-auto pr-2">
            {teams.map((team, index) => (
              <div key={index} className="rounded-lg bg-secondary p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  {team.name} ({team.members.length})
                </h3>
                <ul className="space-y-1">
                  {team.members.map((member, memberIndex) => (
                    <li key={memberIndex} className="text-sm py-1 px-2 rounded-lg bg-white/50 dark:bg-black/10">
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-4">
            <button
              onClick={() => drawTeams()}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Sortear Novamente
            </button>
          </div>
        </div>
      </ResultModal>
    </div>
  );
};

export default TeamDraw;
