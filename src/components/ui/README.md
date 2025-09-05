# UI Components Library

Biblioteka reusable komponentów UI dla projektu Webinfo2.

## 🎉 Status projektu

✅ **UI Library** - W pełni funkcjonalna  
✅ **UploadWorkflow** - Przywrócona pełna funkcjonalność  
✅ **Integration** - Wszystkie komponenty zintegrowane  
✅ **Build** - Projekt buduje się bez błędów  

## 📦 Dostępne komponenty

### Button
Uniwersalny komponent przycisku z wariantami stylów.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="large" onClick={handleClick}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean

### Card
Komponent karty z hover efektami i różnymi wariantami padding.

```tsx
import { Card } from '@/components/ui';

<Card hoverable padding="large" onClick={handleClick}>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

**Props:**
- `hoverable`: boolean
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `onClick`: () => void

### Input
Komponent input z różnymi rozmiarami i stanami.

```tsx
import { Input } from '@/components/ui';

<Input 
  type="email"
  placeholder="Enter email"
  fullWidth
  error={hasError}
  onChange={handleChange}
/>
```

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel'
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: boolean
- `error`: boolean
- `disabled`: boolean

### Container
Główny kontener strony z responsywnym layoutem.

```tsx
import { Container } from '@/components/ui';

<Container padding="large" maxWidth="1200px" centerContent>
  <h1>Page content</h1>
</Container>
```

**Props:**
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `maxWidth`: string
- `centerContent`: boolean

### LoadingSpinner
Animowany spinner do wskazywania stanu ładowania.

```tsx
import { LoadingSpinner } from '@/components/ui';

<LoadingSpinner size="large" color="#126678" />
```

**Props:**
- `size`: 'small' | 'medium' | 'large'
- `color`: string

## 🎨 Design System

### Kolory
- **Primary**: #126678
- **Primary hover**: #0f5459
- **Success**: #065f46
- **Danger**: #dc2626

### Typography
- **Primary font**: Poppins
- **Font sizes**: 12px, 14px, 16px, 24px

### Spacing
- **Small**: 12px
- **Medium**: 24px (default)
- **Large**: 32px

### Border radius
- **Default**: 8px
- **Button**: 5px

## 🛠️ Użycie

Wszystkie komponenty są dostępne z głównego barrel export:

```tsx
import { Button, Card, Input, Container, LoadingSpinner } from '@/components/ui';
```

Każdy komponent ma pełne wsparcie TypeScript z interfejsami props.

## 🔄 Refactoring

Ta biblioteka zastępuje duplikowane styled components w:
- ✅ `UploadWorkflow.tsx` - używa `Button` i `Container`
- ✅ `UploadWorkflow.tsx` - w pełni przywrócony z wszystkimi komponentami
  - ✅ `EmployeeSelector` - zintegrowany
  - ✅ `FileUpload` - zintegrowany  
  - ✅ `DocumentSplitter` - zintegrowany
  - ✅ `CategoryAssignment` - zintegrowany
  - ✅ `FinalPreview` - zintegrowany
- 🔄 Kolejne komponenty do refactoru...

## 📈 Zalety

- **DRY**: Eliminuje duplikację kodu
- **Consistency**: Spójny design w całej aplikacji
- **Maintainability**: Łatwe utrzymanie i aktualizacje
- **Type Safety**: Pełne wsparcie TypeScript
- **Performance**: Optymalizowane styled components

## 🚀 Dalszy rozwój

Planowane rozszerzenia:
- Modal/Dialog
- Dropdown/Select
- DatePicker
- Table
- Toast notifications
- Form components (FormField, ValidationMessage)
