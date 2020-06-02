import { fetchAbstractFromCrossref } from '../../src/api/fetch-article';
import Doi from '../../src/data/doi';

describe('fetch-abstract-from-crossref', (): void => {
  it('returns the abstract for a real DOI', async () => {
    const doi = new Doi('10.1101/339747');
    const abstract = await fetchAbstractFromCrossref(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('bacteria during biofilm growth'));
  });
});
