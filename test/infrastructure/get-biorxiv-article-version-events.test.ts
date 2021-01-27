import { URL } from 'url';
import createGetBiorxivArticleVersionEvents, { GetJson } from '../../src/infrastructure/get-biorxiv-article-version-events';
import { Doi } from '../../src/types/doi';
import dummyLogger from '../dummy-logger';

describe('get-biorxiv-article-version-events', () => {
  describe('when biorxiv is available', () => {
    describe('when the server is biorxiv', () => {
      it('returns an article-version event for each article version', async () => {
        const doi = new Doi('10.1101/2020.09.02.278911');
        const getJson: GetJson = jest.fn(async () => ({
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
        }));

        const getBiorxivArticleVersionEvents = createGetBiorxivArticleVersionEvents(getJson, dummyLogger);

        const events = await getBiorxivArticleVersionEvents(doi, 'biorxiv');

        expect(getJson).toHaveBeenCalledWith('https://api.biorxiv.org/details/biorxiv/10.1101/2020.09.02.278911');
        expect(events).toHaveLength(2);
        expect(events[0]).toStrictEqual({
          source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v2'),
          occurredAt: new Date('2020-01-02'),
          version: 2,
        });
        expect(events[1]).toStrictEqual({
          source: new URL('https://www.biorxiv.org/content/10.1101/2020.09.02.278911v1'),
          occurredAt: new Date('2019-12-31'),
          version: 1,
        });
      });
    });

    describe('when the server is medrxiv', () => {
      it('returns an article-version event for each article version', async () => {
        const doi = new Doi('10.1101/2020.09.02.278911');
        const getJson: GetJson = jest.fn(async () => ({
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
        }));

        const getBiorxivArticleVersionEvents = createGetBiorxivArticleVersionEvents(getJson, dummyLogger);

        const events = await getBiorxivArticleVersionEvents(doi, 'medrxiv');

        expect(getJson).toHaveBeenCalledWith('https://api.biorxiv.org/details/medrxiv/10.1101/2020.09.02.278911');
        expect(events).toHaveLength(2);
        expect(events[0]).toStrictEqual({
          source: new URL('https://www.medrxiv.org/content/10.1101/2020.09.02.278911v2'),
          occurredAt: new Date('2020-01-02'),
          version: 2,
        });
        expect(events[1]).toStrictEqual({
          source: new URL('https://www.medrxiv.org/content/10.1101/2020.09.02.278911v1'),
          occurredAt: new Date('2019-12-31'),
          version: 1,
        });
      });
    });
  });

  describe('when biorxiv is unavailable', () => {
    it('returns an empty list', async () => {
      const getJson: GetJson = async () => {
        throw new Error('HTTP timeout');
      };

      const getBiorxivArticleVersionEvents = createGetBiorxivArticleVersionEvents(getJson, dummyLogger);

      const events = await getBiorxivArticleVersionEvents(new Doi('10.1101/2020.09.02.278911'), 'biorxiv');

      expect(events).toHaveLength(0);
    });
  });

  describe('when biorxiv returns a corrupted response', () => {
    describe('where the fields are missing', () => {
      it('returns an empty list', async () => {
        const getJson: GetJson = async () => ({});

        const getBiorxivArticleVersionEvents = createGetBiorxivArticleVersionEvents(getJson, dummyLogger);

        const events = await getBiorxivArticleVersionEvents(new Doi('10.1101/2020.09.02.278911'), 'biorxiv');

        expect(events).toHaveLength(0);
      });
    });

    describe('where the date is corrupt', () => {
      it('returns an empty list', async () => {
        const getJson: GetJson = async () => ({
          collection: [
            {
              date: 'tree',
              version: '2',
            },
          ],
        });

        const getBiorxivArticleVersionEvents = createGetBiorxivArticleVersionEvents(getJson, dummyLogger);

        const events = await getBiorxivArticleVersionEvents(new Doi('10.1101/2020.09.02.278911'), 'biorxiv');

        expect(events).toHaveLength(0);
      });
    });

    describe('where the version is not a number', () => {
      it('returns an empty list', async () => {
        const getJson: GetJson = async () => ({
          collection: [
            {
              date: '2020-01-01',
              version: 'v1',
            },
          ],
        });

        const getBiorxivArticleVersionEvents = createGetBiorxivArticleVersionEvents(getJson, dummyLogger);

        const events = await getBiorxivArticleVersionEvents(new Doi('10.1101/2020.09.02.278911'), 'biorxiv');

        expect(events).toHaveLength(0);
      });
    });
  });
});
