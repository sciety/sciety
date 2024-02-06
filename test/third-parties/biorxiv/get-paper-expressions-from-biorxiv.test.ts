import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import * as DE from '../../../src/types/data-error';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { getPaperExpressionsFromBiorxiv } from '../../../src/third-parties/biorxiv/get-paper-expressions-from-biorxiv';

describe('get-paper-expressions-from-biorxiv', () => {
  describe('when biorxiv is available', () => {
    describe('when the server is biorxiv', () => {
      it.failing('returns an article-version event for each article version', async () => {
        const expressionDoi = arbitraryExpressionDoi();
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
          getPaperExpressionsFromBiorxiv({ queryExternalService, logger: dummyLogger })(expressionDoi, 'biorxiv'),
          T.map(E.getOrElseW(() => [])),
        )();

        expect(events).toHaveLength(2);
        expect(events[0]).toStrictEqual({
          expressionType: 'preprint',
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.biorxiv.org/content/${expressionDoi}v2`),
          publishedAt: new Date('2020-01-02'),
          server: O.some('biorxiv'),
        });
        expect(events[1]).toStrictEqual({
          expressionType: 'preprint',
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.biorxiv.org/content/${expressionDoi}v1`),
          publishedAt: new Date('2019-12-31'),
          server: O.some('biorxiv'),
        });
      });
    });

    describe('when the server is medrxiv', () => {
      it.failing('returns an article-version event for each article version', async () => {
        const expressionDoi = arbitraryExpressionDoi();
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
          getPaperExpressionsFromBiorxiv({ queryExternalService, logger: dummyLogger })(expressionDoi, 'medrxiv'),
          T.map(E.getOrElseW(() => [])),
        )();

        expect(events).toHaveLength(2);
        expect(events[0]).toStrictEqual({
          expressionType: 'preprint',
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.medrxiv.org/content/${expressionDoi}v2`),
          publishedAt: new Date('2020-01-02'),
          server: O.some('medrxiv'),
        });
        expect(events[1]).toStrictEqual({
          expressionType: 'preprint',
          expressionDoi,
          publisherHtmlUrl: new URL(`https://www.medrxiv.org/content/${expressionDoi}v1`),
          publishedAt: new Date('2019-12-31'),
          server: O.some('medrxiv'),
        });
      });
    });
  });

  describe('when biorxiv is unavailable', () => {
    it('returns a left', async () => {
      const queryExternalService = () => () => TE.left(DE.unavailable);

      const events = await getPaperExpressionsFromBiorxiv({ queryExternalService, logger: dummyLogger })(arbitraryExpressionDoi(), 'biorxiv')();

      expect(E.isLeft(events)).toBe(true);
    });
  });

  describe('when biorxiv returns a corrupted response', () => {
    describe('where the fields are missing', () => {
      it('returns a left', async () => {
        const queryExternalService = () => () => TE.right({});

        const events = await getPaperExpressionsFromBiorxiv({ queryExternalService, logger: dummyLogger })(arbitraryExpressionDoi(), 'biorxiv')();

        expect(E.isLeft(events)).toBe(true);
      });
    });

    describe('where the date is corrupt', () => {
      it('returns a left', async () => {
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

        const events = await getPaperExpressionsFromBiorxiv({ queryExternalService, logger: dummyLogger })(arbitraryExpressionDoi(), 'biorxiv')();

        expect(E.isLeft(events)).toBe(true);
      });
    });

    describe('where the version is not a number', () => {
      it('returns a left', async () => {
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

        const events = await getPaperExpressionsFromBiorxiv({ queryExternalService, logger: dummyLogger })(arbitraryExpressionDoi(), 'biorxiv')();

        expect(E.isLeft(events)).toBe(true);
      });
    });
  });
});
