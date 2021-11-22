import * as E from 'fp-ts/Either';
import { medrxivOrBiorxivLinkToDoi } from '../../src/ingest/medrxiv-or-biorxiv-link-to-doi';

describe('medrxiv-or-biorxiv-link-to-doi', () => {
  describe.each([
    ['medrxiv link', 'https://www.medrxiv.org/content/10.1101/2021.06.18.21258689v1', '10.1101/2021.06.18.21258689'],
    ['medrxiv cgi short', 'http://medrxiv.org/cgi/content/short/2020.04.08.20058073', '10.1101/2020.04.08.20058073'],
    ['medrxiv https cgi short', 'https://medrxiv.org/cgi/content/short/2020.07.31.20161216', '10.1101/2020.07.31.20161216'],
    ['medrxiv early with date and full pdf', 'https://www.medrxiv.org/content/medrxiv/early/2021/07/03/2021.06.28.21259452.full.pdf', '10.1101/2021.06.28.21259452'],
    ['biorxiv link', 'https://biorxiv.org/content/10.1101/2021.11.04.467308v1', '10.1101/2021.11.04.467308'],
  ])('%s', (_, input, expectedDoi) => {
    it('extracts the doi from the input', () => {
      const result = medrxivOrBiorxivLinkToDoi(input);

      expect(result).toStrictEqual(E.right(expectedDoi));
    });
  });

  describe('when the input is empty', () => {
    const input = '';

    it('returns a left', () => {
      const result = medrxivOrBiorxivLinkToDoi('');

      expect(result).toStrictEqual(E.left(`link not parseable for DOI: "${input}"`));
    });
  });
});
