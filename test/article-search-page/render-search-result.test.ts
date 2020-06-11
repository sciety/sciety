import createRenderSearchResult, {
  GetCommentCount,
  GetEndorsingEditorialCommunities,
} from '../../src/article-search-page/render-search-result';
import Doi from '../../src/data/doi';

const getReviewCount = (): number => 2;

describe('render-search-result component', (): void => {
  it('displays title and authors', async (): Promise<void> => {
    const getCommentCount: GetCommentCount = async () => 0;
    const getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities = async () => [];
    const rendered = await createRenderSearchResult(
      getCommentCount,
      getReviewCount,
      getEndorsingEditorialCommunities,
    )({
      doi: new Doi('10.1101/833392'),
      title: 'the title',
      authors: '1, 2, 3',
    });

    expect(rendered).toStrictEqual(expect.stringContaining('10.1101/833392'));
    expect(rendered).toStrictEqual(expect.stringContaining('the title'));
    expect(rendered).toStrictEqual(expect.stringContaining('1, 2, 3'));
  });

  describe('a comment count is available', (): void => {
    it('displays the number of comments', async (): Promise<void> => {
      const getCommentCount: GetCommentCount = async () => 37;
      const getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities = async () => [];
      const rendered = await createRenderSearchResult(
        getCommentCount,
        getReviewCount,
        getEndorsingEditorialCommunities,
      )({
        doi: new Doi('10.1101/833392'),
        title: 'the title',
        authors: '1, 2, 3',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('37'));
    });
  });

  describe('an error is thrown when counting comments', (): void => {
    it('doesn\'t display a count of the comments', async (): Promise<void> => {
      const getCommentCount: GetCommentCount = async () => {
        throw new Error('Comments could not be counted');
      };
      const getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities = async () => [];
      const rendered = await createRenderSearchResult(
        getCommentCount,
        getReviewCount,
        getEndorsingEditorialCommunities,
      )({
        doi: new Doi('10.1101/833392'),
        title: 'the title',
        authors: '1, 2, 3',
      });

      expect(rendered).toStrictEqual(expect.stringContaining('n/a'));
    });
  });
});
