import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { getArticleVersionEventsFromBiorxiv } from '../../../src/third-parties/biorxiv';
import { ArticleId } from '../../../src/types/article-id';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import * as DE from '../../../src/types/data-error';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

describe('get-article-version-events-from-biorxiv', () => {
  describe('when biorxiv is available', () => {
    describe('when the server is biorxiv', () => {
      it('returns an article-version event for each article version', async () => {
        const expressionDoi = arbitraryExpressionDoi();
        const doi = new ArticleId(expressionDoi);
        const queryExternalService = () => () => TE.right({
          collection: [
            {
              date: '2020-01-02',
              version: '2',
              category: arbitraryString(),
              server: 'biorxiv',
            },
            {
              date: '2019-12-31',
              version: '1',
              category: arbitraryString(),
              server: 'biorxiv',
            },
          ],
        });

        const events = await pipe(
          getArticleVersionEventsFromBiorxiv({ queryExternalService, logger: dummyLogger })(doi, 'biorxiv'),
          T.map(O.getOrElseW(() => [])),
        )();

        expect(events).toHaveLength(2);
        expect(events[0]).toStrictEqual({
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.biorxiv.org/content/${expressionDoi}v2`),
          publishedAt: new Date('2020-01-02'),
        });
        expect(events[1]).toStrictEqual({
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.biorxiv.org/content/${expressionDoi}v1`),
          publishedAt: new Date('2019-12-31'),
        });
      });
    });

    describe('when the server is medrxiv', () => {
      it('returns an article-version event for each article version', async () => {
        const expressionDoi = arbitraryExpressionDoi();
        const doi = new ArticleId(expressionDoi);
        const queryExternalService = () => () => TE.right({
          collection: [
            {
              date: '2020-01-02',
              version: '2',
              category: arbitraryString(),
              server: 'medrxiv',
            },
            {
              date: '2019-12-31',
              version: '1',
              category: arbitraryString(),
              server: 'medrxiv',
            },
          ],
        });

        const events = await pipe(
          getArticleVersionEventsFromBiorxiv({ queryExternalService, logger: dummyLogger })(doi, 'medrxiv'),
          T.map(O.getOrElseW(() => [])),
        )();

        expect(events).toHaveLength(2);
        expect(events[0]).toStrictEqual({
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.medrxiv.org/content/${expressionDoi}v2`),
          publishedAt: new Date('2020-01-02'),
        });
        expect(events[1]).toStrictEqual({
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.medrxiv.org/content/${expressionDoi}v1`),
          publishedAt: new Date('2019-12-31'),
        });
      });
    });
  });

  describe('when biorxiv is unavailable', () => {
    it('returns a none', async () => {
      const queryExternalService = () => () => TE.left(DE.unavailable);

      const events = await getArticleVersionEventsFromBiorxiv({ queryExternalService, logger: dummyLogger })(new ArticleId('10.1101/2020.09.02.278911'), 'biorxiv')();

      expect(events).toStrictEqual(O.none);
    });
  });

  describe('when biorxiv returns a corrupted response', () => {
    describe('where the fields are missing', () => {
      it('returns a none', async () => {
        const queryExternalService = () => () => TE.right({});

        const events = await getArticleVersionEventsFromBiorxiv({ queryExternalService, logger: dummyLogger })(new ArticleId('10.1101/2020.09.02.278911'), 'biorxiv')();

        expect(events).toStrictEqual(O.none);
      });
    });

    describe('where the date is corrupt', () => {
      it('returns a none', async () => {
        const queryExternalService = () => () => TE.right({
          collection: [
            {
              date: 'tree',
              version: '2',
              category: arbitraryString(),
              server: 'biorxiv',
            },
          ],
        });

        const events = await getArticleVersionEventsFromBiorxiv({ queryExternalService, logger: dummyLogger })(arbitraryArticleId(), 'biorxiv')();

        expect(events).toStrictEqual(O.none);
      });
    });

    describe('where the version is not a number', () => {
      it('returns a none', async () => {
        const queryExternalService = () => () => TE.right({
          collection: [
            {
              date: '2020-01-01',
              version: 'v1',
              category: arbitraryString(),
              server: 'biorxiv',
            },
          ],
        });

        const events = await getArticleVersionEventsFromBiorxiv({ queryExternalService, logger: dummyLogger })(new ArticleId('10.1101/2020.09.02.278911'), 'biorxiv')();

        expect(events).toStrictEqual(O.none);
      });
    });
  });
});
