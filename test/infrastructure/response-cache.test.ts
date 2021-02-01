/* eslint-disable no-empty */
import { DownstreamFetcher, responseCache } from '../../src/infrastructure/response-cache';
import { Doi } from '../../src/types/doi';
import { dummyLogger } from '../dummy-logger';

describe('article-cache', () => {
  describe('when the required response is not in the cache', () => {
    it('makes a call to the downstream-fetcher', async () => {
      const downstreamFetcher: DownstreamFetcher = async () => 'a-string';
      const spy = jest.fn(downstreamFetcher);
      const articleCache = responseCache(spy, dummyLogger);
      await articleCache(new Doi('10.1101/111111'), '');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('returns the response', async () => {
      const articleCache = responseCache(async () => ('a-string'), dummyLogger);

      const actual = await articleCache(new Doi('10.1101/111111'), '');

      expect(actual).toBe('a-string');
    });

    describe('when the response is ok', () => {
      it('adds the response to the cache', async () => {
        const downstreamFetcher: DownstreamFetcher = async () => 'a-string';
        const spy = jest.fn(downstreamFetcher);
        const articleCache = responseCache(spy, dummyLogger);
        await articleCache(new Doi('10.1101/222222'), '');
        await articleCache(new Doi('10.1101/222222'), '');

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the downstream-fetcher throws', () => {
      it('removes the response from the cache', async () => {
        const downstreamFetcher: DownstreamFetcher = async () => { throw new Error('some-error'); };
        const spy = jest.fn(downstreamFetcher);
        const articleCache = responseCache(spy, dummyLogger);
        try {
          await articleCache(new Doi('10.1101/222222'), '');
        } catch (_: unknown) {}
        try {
          await articleCache(new Doi('10.1101/222222'), '');
        } catch (_: unknown) {}

        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('when the DOI is requested twice simultaneously', () => {
      it('collapses the calls into one', async () => {
        const downstreamFetcher: DownstreamFetcher = async () => 'a-string';
        const spy = jest.fn(downstreamFetcher);
        const articleCache = responseCache(spy, dummyLogger);
        await Promise.all([
          articleCache(new Doi('10.1101/222222'), ''),
          articleCache(new Doi('10.1101/222222'), ''),
        ]);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      describe('and an error happens', () => {
        it('both requests fail', async () => {
          const downstreamFetcher: DownstreamFetcher = async () => { throw new Error('some-error'); };
          const articleCache = responseCache(downstreamFetcher, dummyLogger);
          const results = await Promise.allSettled([
            articleCache(new Doi('10.1101/222222'), ''),
            articleCache(new Doi('10.1101/222222'), ''),
          ]);

          expect(results[0].status).toBe('rejected');
          expect(results[1].status).toBe('rejected');
        });
      });
    });
  });
});
