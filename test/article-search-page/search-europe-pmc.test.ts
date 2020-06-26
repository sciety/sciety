import createSearchEuropePmc from '../../src/article-search-page/search-europe-pmc';
import Doi from '../../src/types/doi';

describe('search-europe-pmc adapter', () => {
  it('converts Europe PMC search result into our Domain Model', async () => {
    const adapter = createSearchEuropePmc(async () => ({
      hitCount: 1,
      resultList: {
        result: [
          {
            doi: '10.1111/1234',
            title: 'Article title',
            authorString: 'Author 1, Author 2',
            firstPublicationDate: '2019-11-07',
          },
        ],
      },
    }));

    const results = await adapter('some query');

    expect(results.total).toStrictEqual(1);
    expect(results.items).toHaveLength(1);
    expect(results.items[0]).toMatchObject({
      doi: new Doi('10.1111/1234'),
      title: 'Article title',
      authors: 'Author 1, Author 2',
      postedDate: new Date('2019-11-07'),
    });
  });
});
