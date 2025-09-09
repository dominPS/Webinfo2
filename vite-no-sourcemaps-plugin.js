// Plugin Vite do całkowitego usuwania source map dla Firefox
export function noSourceMapsPlugin() {
  return {
    name: 'no-source-maps',
    configResolved(config) {
      // Wyłącz wszystkie source mapy
      config.build.sourcemap = false;
      if (config.css) {
        config.css.devSourcemap = false;
      }
      if (config.esbuild) {
        config.esbuild.sourcemap = false;
      }
    },
    generateBundle(options, bundle) {
      // Usuń wszystkie pliki .map z bundle
      Object.keys(bundle).forEach(fileName => {
        if (fileName.endsWith('.map')) {
          delete bundle[fileName];
        }
      });
      
      // Usuń referencje do source map z plików
      Object.values(bundle).forEach(chunk => {
        if (chunk.type === 'chunk' && chunk.code) {
          // Usuń wszystkie komentarze source map
          chunk.code = chunk.code.replace(/\/\*# sourceMappingURL=[^\*]+\*\//g, '');
          chunk.code = chunk.code.replace(/\/\/# sourceMappingURL=.+/g, '');
        }
        if (chunk.type === 'asset' && chunk.source) {
          // Dla CSS także usuń source map
          if (typeof chunk.source === 'string') {
            chunk.source = chunk.source.replace(/\/\*# sourceMappingURL=[^\*]+\*\//g, '');
          }
        }
      });
    },
    transformIndexHtml(html) {
      // Usuń wszelkie referencje do source map z HTML
      return html.replace(/<!--# sourceMappingURL=[^>]+-->/g, '');
    }
  };
}
