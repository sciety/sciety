import { URL } from 'url';
import createGetHardcodedArticleVersionEvents, { GetJson } from '../../src/article-page/get-hardcoded-article-version-events';
import Doi from '../../src/types/doi';
import shouldNotBeCalled from '../should-not-be-called';

describe('get-hardcoded-article-version-events', () => {
  describe('for article 10.1101/2020.09.02.278911', () => {
    it('returns an article-version event for each article version', async () => {
      const doi = new Doi('10.1101/2020.09.02.278911');
      const getJson: GetJson = async () => ({
        collection: [
          {
            date: '2020-01-02',
            version: '2',
          },
          {
            date: '2019-12-31',
            version: '1',
          },
        ],
      });

      const getHardcodedArticleVersionEvents = createGetHardcodedArticleVersionEvents(getJson, shouldNotBeCalled);

      const events = await getHardcodedArticleVersionEvents(doi);

      expect(events).toHaveLength(2);
      expect(events[0]).toStrictEqual({
        type: 'article-version',
        source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v2'),
        postedAt: new Date('2020-01-02'),
        version: 2,
      });
      expect(events[1]).toStrictEqual({
        type: 'article-version',
        source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v1'),
        postedAt: new Date('2019-12-31'),
        version: 1,
      });
    });
  });
});
