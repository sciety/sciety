import createRenderSearchResult, {
  GetCommentCount,
  GetEndorsingEditorialCommunities,
  GetReviewCount,
} from '../../src/article-search-page/render-search-result';
import Doi from '../../src/data/doi';

const searchResult = {
  doi: new Doi('10.1101/833392'),
  title: 'the title',
  authors: '1, 2, 3',
};

const arbitraryCommentCount: GetCommentCount = async () => 0;
const arbitraryReviewCount: GetReviewCount = async () => 0;
const arbitraryEndorsingEditorialCommunities: GetEndorsingEditorialCommunities = async () => [];

describe('render-search-result component', (): void => {
  it('displays title and authors', async (): Promise<void> => {
    const rendered = await createRenderSearchResult(
      arbitraryCommentCount,
      arbitraryReviewCount,
      arbitraryEndorsingEditorialCommunities,
    )(searchResult);

    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.doi.value));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.title));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.authors));
  });

  it('displays the posted date', async (): Promise<void> => {
    const rendered = await createRenderSearchResult(
      arbitraryCommentCount,
      arbitraryReviewCount,
      arbitraryEndorsingEditorialCommunities,
    )({ ...searchResult, postedDate: new Date('2017-11-30') });

    expect(rendered).toStrictEqual(expect.stringMatching(/Posted[\s\S]*?Nov 30, 2017/));
  });

  describe('the article has reviews', (): void => {
    it('displays the number of reviews', async (): Promise<void> => {
      const getReviewCount: GetReviewCount = async () => 37;

      const rendered = await createRenderSearchResult(
        arbitraryCommentCount,
        getReviewCount,
        arbitraryEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.stringMatching(/Reviews[\s\S]*?37/));
    });
  });

  describe('the article has no reviews', (): void => {
    it('hides the number of reviews', async (): Promise<void> => {
      const getReviewCount: GetReviewCount = async () => 0;

      const rendered = await createRenderSearchResult(
        arbitraryCommentCount,
        getReviewCount,
        arbitraryEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.not.stringContaining('Reviews'));
    });
  });

  describe('an article has comments', (): void => {
    it('displays the number of comments', async (): Promise<void> => {
      const getCommentCount: GetCommentCount = async () => 37;
      const rendered = await createRenderSearchResult(
        getCommentCount,
        arbitraryReviewCount,
        arbitraryEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.stringMatching(/Comments[\s\S]*?37/));
    });
  });

  describe('an article has no comments', (): void => {
    it('hides the number of comments', async (): Promise<void> => {
      const getCommentCount: GetCommentCount = async () => 0;
      const rendered = await createRenderSearchResult(
        getCommentCount,
        arbitraryReviewCount,
        arbitraryEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.not.stringContaining('Comments'));
    });
  });

  describe('an error is thrown when counting comments', (): void => {
    it('hides the number of comments', async (): Promise<void> => {
      const getCommentCount: GetCommentCount = async () => {
        throw new Error('Comments could not be counted');
      };
      const rendered = await createRenderSearchResult(
        getCommentCount,
        arbitraryReviewCount,
        arbitraryEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.not.stringContaining('Comments'));
    });
  });

  describe('a list of endorsing editorial communities is available', (): void => {
    it('displays the endorsing editorial communities', async (): Promise<void> => {
      const getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities = async () => ['PeerJ', 'eLife'];
      const rendered = await createRenderSearchResult(
        arbitraryCommentCount,
        arbitraryReviewCount,
        getEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.stringMatching(/Endorsed by[\s\S]*?PeerJ/));
      expect(rendered).toStrictEqual(expect.stringMatching(/Endorsed by[\s\S]*?eLife/));
    });
  });

  describe('the list of endorsing editorial communities is empty', (): void => {
    it('displays the endorsing editorial communities', async (): Promise<void> => {
      const getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities = async () => [];
      const rendered = await createRenderSearchResult(
        arbitraryCommentCount,
        arbitraryReviewCount,
        getEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.not.stringContaining('Endorsed by'));
    });
  });
});
