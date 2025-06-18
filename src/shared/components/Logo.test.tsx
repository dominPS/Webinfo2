import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { Logo } from '@/shared/components/Logo';

describe('Logo Component', () => {
  it('renders logo with text by default', () => {
    const { container } = render(<Logo />);
    
    // Sprawdź, czy logo SVG jest renderowane
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2); // Powinny być dwa SVG - logo i brand
    
    // Możemy sprawdzić, czy oba SVG mają odpowiednie atrybuty viewBox
    expect(svgs[0]).toHaveAttribute('viewBox', '0 0 36 40');
    expect(svgs[1]).toHaveAttribute('viewBox', '0 0 78 16');
  });

  it('renders only icon when onlyIcon prop is true', () => {
    const { container } = render(<Logo onlyIcon={true} />);
    
    // Gdy onlyIcon jest true, powinno być tylko jedno SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(1);
    
    // To jedno SVG powinno być logo
    expect(svgs[0]).toHaveAttribute('viewBox', '0 0 36 40');
  });

  it('contains correct path elements', () => {
    const { container } = render(<Logo />);
    
    // Sprawdź, czy elementy path są obecne w SVG
    const paths = container.querySelectorAll('path');
    
    // 3 paths w logo + 7 paths w brand (WEBINFO) = 10 paths
    expect(paths.length).toBe(10);
  });
});
