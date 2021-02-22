import * as O from 'fp-ts/Option';
import { ensureBiorxivDoi } from '../../src/article-page/ensure-biorxiv-doi';
import * as Doi from '../../src/types/doi';

describe('ensure-biorxiv-doi', () => {
  it('returns a DOI when the input is valid', async () => {
    const input = '10.1101/111111';

    expect(ensureBiorxivDoi(input)).toStrictEqual(Doi.fromString(input));
  });

  it('returns nothing when the input is not a DOI', async () => {
    expect(ensureBiorxivDoi('1234')).toBe(O.none);
  });

  it('returns nothing when the DOI is not from bioRxiv', async () => {
    expect(ensureBiorxivDoi('10.1234/222222')).toBe(O.none);
  });
});
