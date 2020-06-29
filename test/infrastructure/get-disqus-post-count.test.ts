import { GetCommentCountError } from '../../src/article-search-page/render-search-result';
import createGetDisqusPostCount, { GetJson } from '../../src/infrastructure/get-disqus-post-count';

const uri = 'https://example.com/10.1101/833392';

describe('get-disqus-post-count client', (): void => {
  describe('when Disqus returns a valid response', (): void => {
    it('returns the number of posts', async (): Promise<void> => {
      const getJson: GetJson = async () => (
        {
          response: [{
            posts: 37,
          }],
        }
      );
      const actual = await createGetDisqusPostCount(getJson)(uri);

      expect(actual).toBe(37);
    });
  });

  describe('when Disqus returns an invalid response', (): void => {
    it('throws the port-specific error', async (): Promise<void> => {
      const getJson: GetJson = async () => ({});
      const getDisqusPostCount = createGetDisqusPostCount(getJson);

      await expect(getDisqusPostCount(uri)).rejects.toBeInstanceOf(GetCommentCountError);
    });
  });
});
