import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useHerramientas() {
  return useQuery<Array<{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    icono: string;
    color: string;
    suscrito: boolean | null;
  }>>({
    queryKey: ["/api/herramientas"],
  });
}

export function useToggleHerramienta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/herramientas/${id}/toggle`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/herramientas"] });
    },
  });
}
