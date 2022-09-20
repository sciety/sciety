import { langAttributeFor } from '../../src/shared-components/lang-attribute-for';

describe('lang-attribute-for', () => {
  describe('when the language cannot be inferred', () => {
    it('does not return a lang attribute', async () => {
      expect(langAttributeFor('12345')).toBe('');
    });
  });
});
