import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { URL } from 'url';
import * as PH from '../../src/types/publishing-history';
import { arbitraryPaperExpression } from './paper-expression.helper';
import { shouldNotBeCalled } from '../should-not-be-called';
import { PaperExpression } from '../../src/types/paper-expression';
import * as EDOI from '../../src/types/expression-doi';

describe('publishing-history', () => {
  describe('given both preprint and journal article expressions', () => {
    const earlierExpression: PaperExpression = {
      ...arbitraryPaperExpression(),
      publishedAt: new Date('1999-09-09'),
    };
    const latestPreprintExpression: PaperExpression = {
      ...arbitraryPaperExpression(),
      expressionType: 'preprint',
      publishedAt: new Date('2015-11-12'),
    };
    const latestExpression: PaperExpression = {
      ...arbitraryPaperExpression(),
      expressionType: 'journal-article',
      publishedAt: new Date('2024-01-23'),
    };
    const publishingHistory: PH.PublishingHistory = pipe(
      [
        latestExpression,
        latestPreprintExpression,
        earlierExpression,
      ],
      PH.fromExpressions,
      E.getOrElseW(shouldNotBeCalled),
    );

    describe('getLatestExpression', () => {
      const result = pipe(
        publishingHistory,
        PH.getLatestExpression,
      );

      it('returns the latest expression', () => {
        expect(result).toStrictEqual(latestExpression);
      });
    });

    describe('getAllExpressionDois', () => {
      const result = PH.getAllExpressionDois(publishingHistory);

      it('returns all the paper\'s expression DOIs', () => {
        expect(result).toHaveLength(3);
        expect(result).toContain(latestExpression.expressionDoi);
        expect(result).toContain(earlierExpression.expressionDoi);
      });
    });

    describe('getLatestPreprintExpression', () => {
      const result = pipe(
        publishingHistory,
        PH.getLatestPreprintExpression,
      );

      it('returns the latest expression that is a preprint', () => {
        expect(result).toStrictEqual(latestPreprintExpression);
      });
    });
  });

  describe('given a journal-article expression published on eLife and its version-less alias', () => {
    describe('getLatestPreprintExpression', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const paperExpression1: PaperExpression = {
        expressionType: 'journal-article',
        expressionDoi: EDOI.fromValidatedString('10.7554/elife.90184.4'),
        publisherHtmlUrl: new URL('https://elifesciences.org/articles/90184'),
        publishedAt: new Date('2024-01-17'),
        server: O.some('elife'),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const paperExpression2: PaperExpression = {
        expressionType: 'journal-article',
        expressionDoi: EDOI.fromValidatedString('10.7554/elife.90184'),
        publisherHtmlUrl: new URL('https://elifesciences.org/articles/90184'),
        publishedAt: new Date('2024-01-17'),
        server: O.some('elife'),
      };

      it.todo('ambiguous');
    });
  });

  describe('given two preprint expressions published on bioRxiv on the same date', () => {
    describe('getLatestPreprintExpression', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const paperExpression1: PaperExpression = {
        expressionType: 'preprint',
        expressionDoi: EDOI.fromValidatedString('10.1101/2022.06.22.497259'),
        publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.06.22.497259v1'),
        publishedAt: new Date('2024-01-17'),
        server: O.some('biorxiv'),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const paperExpression2: PaperExpression = {
        expressionType: 'preprint',
        expressionDoi: EDOI.fromValidatedString('10.1101/2022.06.22.497259'),
        publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.06.22.497259v2'),
        publishedAt: new Date('2024-01-17'),
        server: O.some('biorxiv'),
      };

      it.todo('ambiguous');
    });
  });

  describe('given no expressions are provided', () => {
    const providedExpressions: ReadonlyArray<PaperExpression> = [];

    describe('when constructed', () => {
      const result = PH.fromExpressions(providedExpressions);

      it('returns on the left with "empty-publishing-history"', () => {
        expect(result).toStrictEqual(E.left('empty-publishing-history'));
      });
    });
  });

  describe('given only non-preprint expressions are provided', () => {
    const providedExpressions: ReadonlyArray<PaperExpression> = [
      {
        ...arbitraryPaperExpression(),
        expressionType: 'journal-article',
      },
      {
        ...arbitraryPaperExpression(),
        expressionType: 'journal-article',
      },
    ];

    describe('when constructed', () => {
      const result = PH.fromExpressions(providedExpressions);

      it('returns on the left with "no-preprints-in-publishing-history"', () => {
        expect(result).toStrictEqual(E.left('no-preprints-in-publishing-history'));
      });
    });
  });
});
