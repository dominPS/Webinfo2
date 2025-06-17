import '@emotion/react'
import type { Theme as CustomTheme } from './shared/theme'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends CustomTheme {}
}
