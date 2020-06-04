import { createRenderSearchResults, MakeHttpRequest } from '../../src/article-search-page';

describe('render-search-results component', (): void => {
  describe('when there are results', (): void => {
    it('displays the number of results and a list', async (): Promise<void> => {
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

  describe('when there are no results', (): void => {
    it('doesn\'t display any list', async (): Promise<void> => {
      const makeHttpRequest: MakeHttpRequest = async () => (
        {
          hitCount: 0,
          resultList: {
            result: [],
          },
        }
      );
      const rendered = await createRenderSearchResults(makeHttpRequest)('10.1101/833392');

      expect(rendered).toStrictEqual(expect.stringContaining('0 search results'));
      expect(rendered).toStrictEqual(expect.not.stringContaining('<ul>'));
    });
  });
});
