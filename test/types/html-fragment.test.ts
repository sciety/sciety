import { html } from '../../src/types/html-fragment';

describe('html', () => {
  const eggs = 'eggs';

  it('concatenates literals and substitutions', () => {
    expect(html`spam`).toBe('spam');
    expect(html`${eggs}`).toBe('eggs');
    expect(html`spam${eggs}`).toBe('spameggs');
    expect(html`${eggs}spam${eggs}`).toBe('eggsspameggs');
    expect(html`${eggs}spam`).toBe('eggsspam');
  });
});
