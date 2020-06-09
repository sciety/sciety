import createRenderSearchResult from '../../src/article-search-page/render-search-result';
import createRenderSearchResults, { GetJson } from '../../src/article-search-page/render-search-results';

const getReviewCount = (): number => 2;

describe('render-search-results component', (): void => {
  describe('when there are results', (): void => {
    it('displays the number of results and a list', async (): Promise<void> => {
      const getJson: GetJson = async () => (
        {
          hitCount: 5,
          resultList: {
            result: [
              {
                doi: '10.1101/833392',
                title: 'the title',
                authorString: '1, 2, 3',
              },
            ],
          },
        }
      );
      const renderSearchResult = createRenderSearchResult(getJson, getReviewCount);
      const rendered = await createRenderSearchResults(getJson, renderSearchResult)('10.1101/833392');

      expect(rendered).toStrictEqual(expect.stringContaining('5 search results'));
      expect(rendered).toStrictEqual(expect.stringContaining('<ul'));
    });
  });

  describe('when there are no results', (): void => {
    it('doesn\'t display any list', async (): Promise<void> => {
      const getJson: GetJson = async () => (
        {
          hitCount: 0,
          resultList: {
            result: [],
          },
        }
      );
      const renderSearchResult = createRenderSearchResult(getJson, getReviewCount);
      const rendered = await createRenderSearchResults(getJson, renderSearchResult)('10.1101/833392');

      expect(rendered).toStrictEqual(expect.stringContaining('0 search results'));
      expect(rendered).toStrictEqual(expect.not.stringContaining('<ul'));
    });
  });
});
