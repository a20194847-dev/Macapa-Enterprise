import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProyectos() {
  return useQuery<Array<{
    id: number;
    nombre: string;
    cliente: string;
    tipo: string;
    estado: string;
    nivelRiesgo: string;
    probabilidadFraude: number | null;
    anomalias: number | null;
    fecha: string;
  }>>({
    queryKey: ["/api/proyectos"],
  });
}

export function useCasos() {
  return useQuery<Array<{
    id: number;
    nombre: string;
    tipo: string;
    fecha: string;
    anomalias: number | null;
    probabilidadFraude: number | null;
    nivelRiesgo: string;
    hallazgos: string;
    etiquetas: string;
  }>>({
    queryKey: ["/api/casos"],
  });
}

export function useLogs() {
  return useQuery<Array<{
    id: number;
    agenteNombre: string;
    accion: string;
    detalles: string;
    sesgoDetectado: boolean | null;
    correccionAplicada: string | null;
    timestamp: string;
    auditoriaId?: number | null;
    faseId?: number | null;
  }>>({
    queryKey: ["/api/logs"],
    refetchInterval: 3000,
  });
}

export function useAgentes() {
  return useQuery<Array<{
    id: number;
    nombre: string;
    rol: string;
    avatar: string;
    experiencia: string;
    credenciales: string | null;
    especialidad: string;
    estado: string | null;
    color: string;
    personalidad: string | null;
    estiloRespuesta: string | null;
    saludoDefault: string | null;
    precision: number | null;
  }>>({
    queryKey: ["/api/agentes"],
  });
}

export function useEjecutarAnalisis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/analisis/ejecutar", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Analysis failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
    },
  });
}
