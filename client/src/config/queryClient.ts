import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    // Peticiones GET, consultas de datos
    queries: {
      retry: 1, // Reintentar una vez en caso de fallo
      staleTime: 1000 * 60 * 5, // Datos Frescos por 5 minutos (reutiliza desde cache durante 5 minutos hasta vencimiento)
    },
    // POST, PUT y DELETE, mutaciones de datos
    mutations: {
      retry: 0, // Si falta evita reintentos (evitar registros duplicados)
    },
  },
});
