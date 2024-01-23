import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as PH from '../../src/types/publishing-history';
import { arbitraryPaperExpression } from './paper-expression.helper';
import { shouldNotBeCalled } from '../should-not-be-called';
import { PaperExpression } from '../../src/types/paper-expression';

describe('publishing-history', () => {
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
  const publishingHistory: PH.PublishingHistory = PH.fromExpressions(
    [
      latestExpression,
      latestPreprintExpression,
      earlierExpression,
    ],
  );

  describe('getLatestExpression', () => {
    const result = pipe(
      publishingHistory,
      PH.getLatestExpression,
      O.getOrElseW(shouldNotBeCalled),
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
      O.getOrElseW(shouldNotBeCalled),
    );

    it('returns the latest expression that is a preprint', () => {
      expect(result).toStrictEqual(latestPreprintExpression);
    });
  });
});
