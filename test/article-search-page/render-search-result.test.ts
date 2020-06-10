import createRenderSearchResult, { GetCommentCount } from '../../src/article-search-page/render-search-result';

const getReviewCount = (): number => 2;

describe('render-search-result component', (): void => {
  describe('a comment count is available', (): void => {
    it('displays the number of comments', async (): Promise<void> => {
      const getCommentCount: GetCommentCount = async () => 37;
      const rendered = await createRenderSearchResult(getCommentCount, getReviewCount)({
        doi: '10.1101/833392',
        title: 'the title',
        authorString: '1, 2, 3',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('10.1101/833392'));
      expect(rendered).toStrictEqual(expect.stringContaining('37'));
      expect(rendered).toStrictEqual(expect.stringContaining('1, 2, 3'));
    });
  });

  describe('an error is thrown when counting comments', (): void => {
    it('doesn\'t display a count of the comments', async (): Promise<void> => {
      const getCommentCount: GetCommentCount = async () => {
        throw new Error('Comments could not be counted');
      };
      const rendered = await createRenderSearchResult(getCommentCount, getReviewCount)({
        doi: '10.1101/833392',
        title: 'the title',
        authorString: '1, 2, 3',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('n/a'));
    });
  });
});
