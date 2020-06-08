import createRenderSearchResult, { GetJson } from '../../src/article-search-page/render-search-result';

describe('render-search-result component', (): void => {
  describe('when Disqus returns a valid response', (): void => {
    it('displays the number of comments', async (): Promise<void> => {
      const getJson: GetJson = async () => (
        {
          response: [{
            posts: 37,
          }],
        }
      );
      const rendered = await createRenderSearchResult(getJson)({
        doi: '10.1101/833392',
        title: 'the title',
        authorString: '1, 2, 3',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('37'));
    });
  });

  describe('when Disqus returns an invalid response', (): void => {
    it('doesn\'t display a count of the comments', async (): Promise<void> => {
      const getJson: GetJson = async () => ({});
      const rendered = await createRenderSearchResult(getJson)({
        doi: '10.1101/833392',
        title: 'the title',
        authorString: '1, 2, 3',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('n/a'));
    });
  });
});
