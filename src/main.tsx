import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Global } from '@emotion/react'
import { globalStyles } from '@/shared/styles/global'
import { App } from './App'
import './i18n'

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
