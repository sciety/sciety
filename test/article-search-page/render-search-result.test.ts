import createRenderSearchResult, {
  GetEndorsingEditorialCommunityNames,
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

const arbitraryReviewCount: GetReviewCount = async () => 0;
const arbitraryEndorsingEditorialCommunities: GetEndorsingEditorialCommunityNames = async () => [];

describe('render-search-result component', (): void => {
  it('displays title and authors', async (): Promise<void> => {
    const rendered = await createRenderSearchResult(
      arbitraryReviewCount,
      arbitraryEndorsingEditorialCommunities,
    )(searchResult);

    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.doi.value));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.title));
    expect(rendered).toStrictEqual(expect.stringContaining(searchResult.authors));
  });

  it('displays the posted date', async (): Promise<void> => {
    const rendered = await createRenderSearchResult(
      arbitraryReviewCount,
      arbitraryEndorsingEditorialCommunities,
    )(searchResult);

    expect(rendered).toStrictEqual(expect.stringMatching(/Posted[\s\S]*?Nov 30, 2017/));
  });

  describe('the article has reviews', (): void => {
    it('displays the number of reviews', async (): Promise<void> => {
      const getReviewCount: GetReviewCount = async () => 37;

      const rendered = await createRenderSearchResult(
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
        getReviewCount,
        arbitraryEndorsingEditorialCommunities,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.not.stringContaining('Reviews'));
    });
  });

  describe('a list of endorsing editorial communities is available', (): void => {
    it('displays the endorsing editorial communities', async (): Promise<void> => {
      const getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames = async () => ['PeerJ', 'eLife'];
      const rendered = await createRenderSearchResult(
        arbitraryReviewCount,
        getEndorsingEditorialCommunityNames,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.stringMatching(/Endorsed by[\s\S]*?PeerJ/));
      expect(rendered).toStrictEqual(expect.stringMatching(/Endorsed by[\s\S]*?eLife/));
    });
  });

  describe('the list of endorsing editorial communities is empty', (): void => {
    it('displays the endorsing editorial communities', async (): Promise<void> => {
      const getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames = async () => [];
      const rendered = await createRenderSearchResult(
        arbitraryReviewCount,
        getEndorsingEditorialCommunityNames,
      )(searchResult);

      expect(rendered).toStrictEqual(expect.not.stringContaining('Endorsed by'));
    });
  });
});
