import { createRenderSearchResults, MakeHttpRequest } from '../../src/article-search-page';

describe('render-search-results component', (): void => {
  it('queries by a DOI', async (): Promise<void> => {
    const makeHttpRequest: MakeHttpRequest = async () => (
      {
        hitCount: 5,
        resultList: {
          result: [
            {
              doi: '10.1101/833392',
              title: 'the title',
            },
          ],
        },
      }
    );
    const rendered = await createRenderSearchResults(makeHttpRequest)('10.1101/833392');

    expect(rendered).toStrictEqual(expect.stringContaining('10.1101/833392'));
    expect(rendered).toStrictEqual(expect.stringContaining('5 search results'));
  });
});
