import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import {
  createRenderSearchResult,
  GetReviewCount,
  SearchResult,
} from '../../src/article-search-page/render-search-result';
import { Doi } from '../../src/types/doi';

const searchResult: SearchResult = {
  _tag: 'Article',
  doi: new Doi('10.1101/833392'),
  title: 'the title',
  authors: '1, 2, 3',
  postedDate: new Date('2017-11-30'),
  reviewCount: O.some(0),
};

const arbitraryReviewCount: GetReviewCount = () => TE.right(0);

describe('render-search-result component', () => {
  it('displays title and authors', async () => {
    const rendered = await createRenderSearchResult(arbitraryReviewCount)(searchResult)();

    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.doi.value));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.title));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.authors));
  });

  it('displays the posted date', async () => {
    const rendered = await createRenderSearchResult(arbitraryReviewCount)(searchResult)();

    expect(rendered).toStrictEqual(expect.stringMatching(/Posted[\s\S]*?Nov 30, 2017/));
  });

  describe('the article has reviews', () => {
    it('displays the number of reviews', async () => {
      const getReviewCount: GetReviewCount = () => TE.right(37);

      const rendered = await createRenderSearchResult(getReviewCount)(searchResult)();

      expect(rendered).toStrictEqual(expect.stringMatching(/Reviews[\s\S]*?37/));
    });
  });

  describe('the article has no reviews', () => {
    it('hides the number of reviews', async () => {
      const getReviewCount: GetReviewCount = () => TE.right(0);

      const rendered = await createRenderSearchResult(getReviewCount)(searchResult)();

      expect(rendered).toStrictEqual(expect.not.stringContaining('Reviews'));
    });
  });

  describe('can\'t retrive reviews', () => {
    it('hides the number of reviews', async () => {
      const getReviewCount: GetReviewCount = () => TE.left('some error');

      const rendered = await createRenderSearchResult(getReviewCount)(searchResult)();

      expect(rendered).toStrictEqual(expect.not.stringContaining('Reviews'));
    });
  });
});
