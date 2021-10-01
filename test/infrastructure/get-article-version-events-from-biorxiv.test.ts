import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { getArticleVersionEventsFromBiorxiv } from '../../src/infrastructure/get-article-version-events-from-biorxiv';
import { Doi } from '../../src/types/doi';
import { dummyLogger } from '../dummy-logger';
import { arbitraryDoi } from '../types/doi.helper';

describe('get-article-version-events-from-biorxiv', () => {
  describe('when biorxiv is available', () => {
    describe('when the server is biorxiv', () => {
      it('returns an article-version event for each article version', async () => {
        const doi = new Doi('10.1101/2020.09.02.278911');
        const getJson = jest.fn(async () => ({
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

        const events = await pipe(
          getArticleVersionEventsFromBiorxiv({ getJson, logger: dummyLogger })(doi, 'biorxiv'),
          T.map(O.getOrElseW(() => [])),
        )();

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
        const getJson = jest.fn(async () => ({
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

        const events = await pipe(
          getArticleVersionEventsFromBiorxiv({ getJson, logger: dummyLogger })(doi, 'medrxiv'),
          T.map(O.getOrElseW(() => [])),
        )();

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
    it('returns a none', async () => {
      const getJson = async (): Promise<never> => {
        throw new Error('HTTP timeout');
      };

      const events = await getArticleVersionEventsFromBiorxiv({ getJson, logger: dummyLogger })(new Doi('10.1101/2020.09.02.278911'), 'biorxiv')();

      expect(events).toStrictEqual(O.none);
    });
  });

  describe('when biorxiv returns a corrupted response', () => {
    describe('where the fields are missing', () => {
      it('returns a none', async () => {
        const getJson = async (): Promise<Json> => ({});

        const events = await getArticleVersionEventsFromBiorxiv({ getJson, logger: dummyLogger })(new Doi('10.1101/2020.09.02.278911'), 'biorxiv')();

        expect(events).toStrictEqual(O.none);
      });
    });

    describe('where the date is corrupt', () => {
      it('returns a none', async () => {
        const getJson = async (): Promise<Json> => ({
          collection: [
            {
              date: 'tree',
              version: '2',
            },
          ],
        });

        const events = await getArticleVersionEventsFromBiorxiv({ getJson, logger: dummyLogger })(arbitraryDoi(), 'biorxiv')();

        expect(events).toStrictEqual(O.none);
      });
    });

    describe('where the version is not a number', () => {
      it('returns a none', async () => {
        const getJson = async (): Promise<Json> => ({
          collection: [
            {
              date: '2020-01-01',
              version: 'v1',
            },
          ],
        });

        const events = await getArticleVersionEventsFromBiorxiv({ getJson, logger: dummyLogger })(new Doi('10.1101/2020.09.02.278911'), 'biorxiv')();

        expect(events).toStrictEqual(O.none);
      });
    });
  });
});
