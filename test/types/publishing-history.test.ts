import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryPaperExpression } from './paper-expression.helper';
import * as EDOI from '../../src/types/expression-doi';
import { PaperExpression } from '../../src/types/paper-expression';
import * as PH from '../../src/types/publishing-history';
import { shouldNotBeCalled } from '../should-not-be-called';

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

  describe('given two expressions that have been published on the same date and have the same publisherHtmlUrl', () => {
    const paperExpression1: PaperExpression = {
      ...arbitraryPaperExpression(),
      expressionDoi: EDOI.fromValidatedString('10.7554/elife.90184'),
      publisherHtmlUrl: new URL('https://elifesciences.org/articles/90184'),
      publishedAt: new Date('2024-01-17'),
    };

    const paperExpression2: PaperExpression = {
      ...arbitraryPaperExpression(),
      expressionDoi: EDOI.fromValidatedString('10.7554/elife.90184.4'),
      publisherHtmlUrl: new URL('https://elifesciences.org/articles/90184'),
      publishedAt: new Date('2024-01-17'),
    };

    const publishingHistory: PH.PublishingHistory = pipe(
      [
        paperExpression2,
        {
          ...arbitraryPaperExpression(),
          expressionType: 'preprint',
          publishedAt: new Date('2024-01-16'),
        },
        paperExpression1,
      ],
      PH.fromExpressions,
      E.getOrElseW(shouldNotBeCalled),
    );

    describe('getLatestExpression', () => {
      const result = pipe(
        publishingHistory,
        PH.getLatestExpression,
      );

      it('returns the last expression based on alphabetical sorting of expression dois', () => {
        expect(result).toStrictEqual(paperExpression2);
      });
    });
  });

  describe('given two expressions with the same doi that have been published on the same date and have different publisherHtmlUrl', () => {
    const paperExpression1: PaperExpression = {
      ...arbitraryPaperExpression(),
      expressionDoi: EDOI.fromValidatedString('10.1101/2022.06.22.497259'),
      publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.06.22.497259v1'),
      publishedAt: new Date('2024-01-17'),
    };

    const paperExpression2: PaperExpression = {
      ...arbitraryPaperExpression(),
      expressionDoi: EDOI.fromValidatedString('10.1101/2022.06.22.497259'),
      publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2022.06.22.497259v2'),
      publishedAt: new Date('2024-01-17'),
    };

    const publishingHistory: PH.PublishingHistory = pipe(
      [
        paperExpression2,
        paperExpression1,
      ],
      PH.fromExpressions,
      E.getOrElseW(shouldNotBeCalled),
    );

    describe('getLatestExpression', () => {
      const result = pipe(
        publishingHistory,
        PH.getLatestExpression,
      );

      it('returns the last expression based on alphabetical sorting of their URLs', () => {
        expect(result).toStrictEqual(paperExpression2);
      });
    });

    describe('getLatestPreprintExpression', () => {
      const result = pipe(
        publishingHistory,
        PH.getLatestPreprintExpression,
      );

      it('returns the last expression based on alphabetical sorting of their URLs', () => {
        expect(result).toStrictEqual(paperExpression2);
      });
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
