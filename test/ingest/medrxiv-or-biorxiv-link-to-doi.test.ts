import { medrxivOrBiorxivLinkToDoi } from '../../src/ingest/medrxiv-or-biorxiv-link-to-doi';

describe('medrxiv-or-biorxiv-link-to-doi', () => {
  describe.each([
    ['medrxiv link', 'https://www.medrxiv.org/content/10.1101/2021.06.18.21258689v1', '10.1101/2021.06.18.21258689'],
  ])('%s', (_, input, expected) => {
    it.skip('extracts the doi from the input', () => {
      const result = medrxivOrBiorxivLinkToDoi(input);

      expect(result).toBe(expected);
    });
  });
});
