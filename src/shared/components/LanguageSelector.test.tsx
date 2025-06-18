import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import { LanguageSelector } from '@/shared/components/LanguageSelector';

// Mockujemy i18n.ts
vi.mock('@/i18n', () => ({
  availableLanguages: {
    en: 'English',
    pl: 'Polski',
    fr: 'Français',
    de: 'Deutsch',
    uk: 'Українська'
  }
}));

describe('LanguageSelector Component', () => {
  it('renders with the current language displayed', () => {
    render(<LanguageSelector />);
    
    // Sprawdź, czy selektor języka jest widoczny
    const languageButton = screen.getByRole('button');
    expect(languageButton).toBeInTheDocument();
    expect(languageButton).toHaveTextContent('English');
  });

  it('opens language menu when clicked', () => {
    render(<LanguageSelector />);
    
    // Kliknij przycisk języka, aby otworzyć menu
    const languageButton = screen.getByRole('button');
    fireEvent.click(languageButton);
    
    // Sprawdź, czy wszystkie języki są w dokumencie
    expect(screen.getByText('languages.pl')).toBeInTheDocument();
    expect(screen.getByText('languages.fr')).toBeInTheDocument();
    expect(screen.getByText('languages.de')).toBeInTheDocument();
    expect(screen.getByText('languages.uk')).toBeInTheDocument();
  });
});
