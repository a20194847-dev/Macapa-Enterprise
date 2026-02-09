import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Brain, X, Send, Minimize2, Maximize2, Sparkles, Loader2, Upload, Link2, File, Cloud, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachment?: { name: string; type: "file" | "link" };
}

interface UploadedFile {
  name: string;
  size: number;
}

const pageContexts: Record<string, string> = {
  "/": "Dashboard principal con métricas de proyectos, análisis IA, riesgo promedio y anomalías detectadas. Muestra proyectos activos y logs de supervisión de agentes.",
  "/proyectos": "Lista de proyectos de auditoría con estados, niveles de riesgo y probabilidad de fraude.",
  "/audit-workbench": "Mesa de trabajo de auditoría con timeline de fases, evidencias y entregables. Permite avanzar fases y asignar agentes.",
  "/deliverable-studio": "Estudio de entregables con gráficos de riesgo, tendencias de anomalías, y templates para generar reportes. Alex Flash es el especialista aquí.",
  "/metodologia": "Metodologías de auditoría disponibles: Financiera, Fraude, Due Diligence, Cumplimiento. Frameworks COSO, ISA 240, SOX, Benford.",
  "/centro-agentes": "Centro de agentes IA con los 5 especialistas: ALEX IA, Alex Flash, CONTRALOR, Agent Alpha, Agent Omega.",
  "/biblioteca-casos": "Biblioteca de casos históricos de auditoría para referencia y aprendizaje.",
  "/marketplace": "Marketplace de herramientas de auditoría disponibles para suscripción.",
  "/configuracion": "Configuración del usuario y preferencias del sistema.",
};

const welcomeMessages: Record<string, string> = {
  "/": "Bienvenido al Dashboard. Veo que tienes proyectos activos. ¿Te ayudo a analizar alguno?",
  "/proyectos": "Aquí puedes ver todos tus proyectos. ¿Necesitas ayuda para evaluar algún riesgo?",
  "/audit-workbench": "Estás en la mesa de trabajo de auditoría. Puedo guiarte en cada fase del proceso.",
  "/deliverable-studio": "Bienvenido al Estudio de Entregables. Si necesitas generar un reporte, puedo llamar a Alex Flash.",
  "/metodologia": "Aquí encontrarás todas las metodologías de auditoría. ¿Quieres que te explique alguna?",
  "/centro-agentes": "Este es el centro de agentes. Cada uno tiene especialidades únicas. ¿Con quién quieres hablar?",
  "/biblioteca-casos": "La biblioteca de casos contiene ejemplos históricos. ¿Buscas algún tipo específico?",
  "/marketplace": "El marketplace tiene herramientas avanzadas. ¿Te ayudo a elegir alguna?",
  "/configuracion": "Aquí puedes ajustar tus preferencias. ¿Necesitas ayuda con algo?",
};

export default function AlexIAFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [cloudLink, setCloudLink] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation();
  const [hasGreeted, setHasGreeted] = useState<Record<string, boolean>>({});

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/ai/chat", {
        agentName: "ALEX IA",
        message,
        sessionId,
        pageContext: pageContexts[location] || "Página de la aplicación MACAPA Server"
      });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }]);
    },
    onError: (error: any) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Error: ${error.message}. Por favor intenta de nuevo.`,
        timestamp: new Date()
      }]);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted[location]) {
      const welcomeMsg = welcomeMessages[location] || "¿En qué puedo ayudarte?";
      setMessages(prev => [...prev, {
        role: "assistant",
        content: welcomeMsg,
        timestamp: new Date()
      }]);
      setHasGreeted(prev => ({ ...prev, [location]: true }));
    }
  }, [isOpen, location, hasGreeted]);

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    
    const userMessage = input.trim();
    const attachments = uploadedFiles.length > 0 
      ? ` [Adjuntos: ${uploadedFiles.map(f => f.name).join(", ")}]`
      : cloudLink ? ` [Link: ${cloudLink}]` : "";
    
    setMessages(prev => [...prev, {
      role: "user",
      content: userMessage + attachments,
      timestamp: new Date()
    }]);
    setInput("");
    setUploadedFiles([]);
    setCloudLink("");
    setShowUpload(false);
    chatMutation.mutate(userMessage + attachments);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const maxSize = 50 * 1024 * 1024;
    Array.from(files).forEach(file => {
      if (uploadedFiles.length >= 100) return;
      if (file.size > maxSize) {
        alert(`${file.name} excede el límite de 50MB`);
        return;
      }
      setUploadedFiles(prev => [...prev, { name: file.name, size: file.size }]);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-0"
          data-testid="button-alex-ia-open"
        >
          <Brain className="h-7 w-7" />
        </Button>
        <Badge 
          className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1.5"
        >
          Online
        </Badge>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col bg-card border rounded-xl shadow-2xl transition-all duration-300",
        isMinimized ? "w-72 h-14" : "w-96 h-[550px]"
      )}
      data-testid="panel-alex-ia-chat"
    >
      <div className="flex items-center justify-between gap-2 p-3 border-b bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">ALEX IA</p>
            <p className="text-[10px] text-muted-foreground">Auditor Forense Principal</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            98%
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setIsMinimized(!isMinimized)}
            data-testid="button-alex-ia-minimize"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setIsOpen(false)}
            data-testid="button-alex-ia-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <Brain className="h-12 w-12 mx-auto mb-3 text-blue-500/50" />
                <p>Soy ALEX IA, tu asistente de auditoría.</p>
                <p className="text-xs mt-1">Puedes adjuntar archivos o links de la nube.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-muted"
                  )}
                  data-testid={`message-${msg.role}-${i}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pensando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showUpload && (
            <div className="px-3 pb-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileUpload}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Archivo (50MB max)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const url = prompt("Pega el link de OneDrive, Google Drive o Dropbox:");
                    if (url) setCloudLink(url);
                  }}
                >
                  <Cloud className="w-3 h-3 mr-1" />
                  Link Cloud
                </Button>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-muted rounded px-2 py-1">
                      <File className="w-3 h-3" />
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="text-muted-foreground">{formatFileSize(f.size)}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-4 w-4"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {cloudLink && (
                <div className="flex items-center gap-2 text-xs bg-muted rounded px-2 py-1">
                  <Link2 className="w-3 h-3" />
                  <span className="flex-1 truncate">{cloudLink}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-4 w-4"
                    onClick={() => setCloudLink("")}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 flex-shrink-0"
                onClick={() => setShowUpload(!showUpload)}
                data-testid="button-alex-ia-attach"
              >
                <Upload className={cn("h-4 w-4", showUpload && "text-primary")} />
              </Button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={chatMutation.isPending}
                data-testid="input-alex-ia-message"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                data-testid="button-alex-ia-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
