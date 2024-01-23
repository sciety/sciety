import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as P from '../../src/types/paper';
import { arbitraryPaperExpression } from './paper-expression.helper';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('paper', () => {
  const latestExpression = {
    ...arbitraryPaperExpression(),
    publishedAt: new Date('2024-01-23'),
  };
  const earlierExpression = {
    ...arbitraryPaperExpression(),
    publishedAt: new Date('1999-09-09'),
  };
  const paper = {
    expressions: [
      latestExpression,
      earlierExpression,
    ],
  };

  describe('getLatestExpression', () => {
    const result = pipe(
      paper,
      P.getLatestExpression,
      O.getOrElseW(shouldNotBeCalled),
    );

    it('returns the latest expression', () => {
      expect(result).toStrictEqual(latestExpression);
    });
  });

  describe('getAllExpressionDois', () => {
    it.todo('returns all the paper\'s expression DOIs');
  });
});
