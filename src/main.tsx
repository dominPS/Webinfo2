
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Global } from '@emotion/react';
import { globalStyles } from './lib/styles/global';
import { App } from './App';
import './app/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Optimized QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Don't refetch on window focus by default (user can manually refresh)
      refetchOnWindowFocus: false,
      // Retry failed requests 3 times
      retry: 3,
      // Exponential backoff for retries
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Keep mutation errors in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
    },
  },
});

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Global styles={globalStyles} />
      <App />
    </QueryClientProvider>
  </StrictMode>
);
