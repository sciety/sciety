import * as T from 'fp-ts/lib/Task';
import createRenderSearchResult, {
  GetReviewCount,
  SearchResult,
} from '../../src/article-search-page/render-search-result';
import Doi from '../../src/types/doi';

const searchResult: SearchResult = {
  doi: new Doi('10.1101/833392'),
  title: 'the title',
  authors: '1, 2, 3',
  postedDate: new Date('2017-11-30'),
};

const arbitraryReviewCount: GetReviewCount = () => T.of(0);

describe('render-search-result component', (): void => {
  it('displays title and authors', async (): Promise<void> => {
    const rendered = await createRenderSearchResult(arbitraryReviewCount)(searchResult)();

    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.doi.value));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.title));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.authors));
  });

  it('displays the posted date', async (): Promise<void> => {
    const rendered = await createRenderSearchResult(arbitraryReviewCount)(searchResult)();

    expect(rendered).toStrictEqual(expect.stringMatching(/Posted[\s\S]*?Nov 30, 2017/));
  });

  describe('the article has reviews', (): void => {
    it('displays the number of reviews', async (): Promise<void> => {
      const getReviewCount: GetReviewCount = () => T.of(37);

      const rendered = await createRenderSearchResult(getReviewCount)(searchResult)();

      expect(rendered).toStrictEqual(expect.stringMatching(/Reviews[\s\S]*?37/));
    });
  });

  describe('the article has no reviews', (): void => {
    it('hides the number of reviews', async (): Promise<void> => {
      const getReviewCount: GetReviewCount = () => T.of(0);

      const rendered = await createRenderSearchResult(getReviewCount)(searchResult);

      expect(rendered).toStrictEqual(expect.not.stringContaining('Reviews'));
    });
  });
});
