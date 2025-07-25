
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
const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Global styles={globalStyles} />
      <App />
    </QueryClientProvider>
  </StrictMode>
);
