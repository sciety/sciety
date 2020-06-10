import createFetchDisqusPostCount, { GetJson } from '../../src/article-search-page/fetch-disqus-post-count';
import Doi from '../../src/data/doi';

const doi = new Doi('10.1101/833392');

describe('fetch-disqus-post-count component', (): void => {
  describe('when Disqus returns a valid response', (): void => {
    it('returns the number of posts', async (): Promise<void> => {
      const getJson: GetJson = async () => (
        {
          response: [{
            posts: 37,
          }],
        }
      );
      const actual = await createFetchDisqusPostCount(getJson)(doi);

      expect(actual).toBe(37);
    });
  });

  describe('when Disqus returns an invalid response', (): void => {
    it('throws an error', async (): Promise<void> => {
      const getJson: GetJson = async () => ({});
      const fetchDisqusPostCount = createFetchDisqusPostCount(getJson);

      await expect(fetchDisqusPostCount(doi)).rejects.toThrow('Cannot read property \'0\' of undefined');
    });
  });
});
