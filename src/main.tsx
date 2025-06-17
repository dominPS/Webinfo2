import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Global } from '@emotion/react'
import { globalStyles } from '@/shared/styles/global'
import { App } from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <Global styles={globalStyles} />
    <App />
  </StrictMode>
)
