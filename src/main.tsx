import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Global } from '@emotion/react'
import { globalStyles } from '@/shared/styles/global'
import { App } from './App'
import i18n from './i18n'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

// Wait for i18n to be initialized before rendering
i18n.on('initialized', () => {
  root.render(
    <StrictMode>
      <Global styles={globalStyles} />
      <App />
    </StrictMode>
  )
})
