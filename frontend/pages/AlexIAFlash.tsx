import { useState } from "react";
import { useAgentes } from "@/hooks/use-cases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Zap, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: number;
  role: "user" | "agent";
  content: string;
  agentName?: string;
}

export default function AlexIAFlash() {
  const { data: agentes } = useAgentes();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "agent", content: "Hola, soy ALEX IA Flash. Estoy listo para generar visualizaciones ejecutivas de alto impacto. ¿Qué análisis necesitas?", agentName: "Alex Flash" }
  ]);
  const [input, setInput] = useState("");
  const [msgId, setMsgId] = useState(2);

  const alexFlash = agentes?.find(a => a.nombre === "Alex Flash");

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", `/api/agentes/${alexFlash?.id || 2}/chat`, { mensaje: message });
      return res.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: msgId + 1,
        role: "agent",
        content: data.respuesta,
        agentName: data.agenteNombre
      }]);
      setMsgId(prev => prev + 2);
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: msgId, role: "user", content: input }]);
    chatMutation.mutate(input);
    setInput("");
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">ALEX IA Flash</h1>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-0">IA</Badge>
          </div>
          <p className="text-muted-foreground">Director Visual Ejecutivo - Reportes de alto impacto para CEOs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">En línea</span>
        </div>
      </div>

      <Card className="glass-panel flex-1 flex flex-col">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Chat con Alex Flash
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary'
                }`}>
                  {msg.role === 'agent' && msg.agentName && (
                    <p className="text-xs font-medium text-yellow-400 mb-1">{msg.agentName}</p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Generando respuesta...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <CardContent className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              data-testid="input-chat-message"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} disabled={chatMutation.isPending} data-testid="button-send-message">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
