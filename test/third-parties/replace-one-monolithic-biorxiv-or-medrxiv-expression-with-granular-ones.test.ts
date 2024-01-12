import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import {
  GetExpressionsFromBiorxiv,
  replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes,
} from '../../src/third-parties/replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones';
import { shouldNotBeCalled } from '../should-not-be-called';
import { PaperExpression } from '../../src/types/paper-expression';
import { arbitraryPaperExpression } from '../types/paper-expression.helper';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

const granularExpressionMatching = (expression: PaperExpression) => ({
  ...arbitraryPaperExpression(),
  expressionDoi: expression.expressionDoi,
  server: expression.server,
});

describe('replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones', () => {
  const serverWithMonolithicExpressions = 'biorxiv' as const;

  describe('given no expressions', () => {
    const getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv = () => TE.right([]);
    let expressions: ReadonlyArray<PaperExpression>;

    beforeEach(async () => {
      expressions = await pipe(
        [],
        replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
          getExpressionsFromBiorxiv,
          serverWithMonolithicExpressions,
          arbitraryExpressionDoi(),
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('makes no changes', () => {
      expect(expressions).toHaveLength(0);
    });
  });

  describe('given one expression that is not on biorxiv or medrxiv', () => {
    it.todo('makes no changes');
  });

  describe('given multiple expressions that are not on biorxiv or medrxiv', () => {
    it.todo('makes no changes');
  });

  describe('given a monolithic biorxiv expression encapsulating three expressions', () => {
    const monolithicExpression: PaperExpression = {
      ...arbitraryPaperExpression(),
      server: O.some(serverWithMonolithicExpressions),
    };
    const getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv = () => TE.right([
      granularExpressionMatching(monolithicExpression),
      granularExpressionMatching(monolithicExpression),
      granularExpressionMatching(monolithicExpression),
    ]);

    let expressions: ReadonlyArray<PaperExpression>;

    beforeEach(async () => {
      expressions = await pipe(
        [monolithicExpression],
        replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes(
          getExpressionsFromBiorxiv,
          serverWithMonolithicExpressions,
          monolithicExpression.expressionDoi,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('replaces the monolithic expression', () => {
      expect(expressions).toHaveLength(3);
    });
  });
});
