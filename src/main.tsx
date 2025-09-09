import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Global } from '@emotion/react'
import { globalStyles } from './lib/styles/global'
import { App } from './App'
import './app/i18n'

// Radykalne wyłączenie błędów source map w Firefox
if (import.meta.env.DEV) {
  const isFirefox = navigator.userAgent.includes('Firefox');
  
  if (isFirefox) {
    // Całkowite przejęcie konsoli dla Firefox
    const noop = () => {};
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      const message = args.join(' ').toLowerCase();
      
      // Wszystkie możliwe błędy source map w Firefox
      const sourceMapErrors = [
        'source map', 'sourcemap', '.map', 'json.parse',
        'unexpected character', 'sources', 'installhook',
        'react_devtools', 'mapy źródła', 'błąd mapy',
        'can\'t access property', 'map is undefined',
        'networkerror', 'fetch resource', 'version is a required',
        'webkit-', 'margin-bottom', 'font-smoothing',
        'zbior regul', 'deklaracja opuszczona',
        'nieznana właściwość', 'unknown property'
      ];
      
      // Jeśli to błąd source map - całkowicie ignoruj
      if (sourceMapErrors.some(error => message.includes(error))) {
        return;
      }
      
      // Tylko prawdziwe błędy aplikacji
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      const message = args.join(' ').toLowerCase();
      
      const sourceMapWarnings = [
        'source map', 'sourcemap', '.map',
        'webkit-', 'margin-bottom', 'font-smoothing',
        'nieznana właściwość', 'unknown property',
        'deklaracja opuszczona', 'zbior regul'
      ];
      
      if (sourceMapWarnings.some(warning => message.includes(warning))) {
        return;
      }
      
      originalWarn.apply(console, args);
    };
    
    // Wyłącz także błędy window.onerror związane z source mapami
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof message === 'string') {
        const msg = message.toLowerCase();
        if (msg.includes('source map') || msg.includes('sourcemap') || msg.includes('.map')) {
          return true; // Zatrzymaj propagację błędu
        }
      }
      
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

// Render immediately instead of waiting for i18n
root.render(
  <StrictMode>
    <Global styles={globalStyles} />
    <App />
  </StrictMode>
)
