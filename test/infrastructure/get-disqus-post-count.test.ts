import createGetDisqusPostCount, { GetJson } from '../../src/infrastructure/get-disqus-post-count';
import dummyLogger from '../dummy-logger';

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
      const actual = await createGetDisqusPostCount(getJson, dummyLogger)(uri);

      expect(actual.unsafelyUnwrap()).toBe(37);
    });
  });

  describe('when Disqus returns an invalid response', (): void => {
    it('throws the domain port-specific error', async (): Promise<void> => {
      const getJson: GetJson = async () => ({});
      const getDisqusPostCount = createGetDisqusPostCount(getJson, dummyLogger);
      const actual = await getDisqusPostCount(uri);

      expect(actual.isNothing()).toBe(true);
    });
  });
});
