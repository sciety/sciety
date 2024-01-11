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

describe('replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones', () => {
  describe('given a monolithic expression encapsulating three expressions', () => {
    const serverWithMonolithicExpressions = 'biorxiv';
    const monolithicExpression: PaperExpression = {
      ...arbitraryPaperExpression(),
      server: O.some(serverWithMonolithicExpressions),
    };
    const getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv = () => TE.right([
      {
        ...arbitraryPaperExpression(),
        expressionDoi: monolithicExpression.expressionDoi,
        server: O.some(serverWithMonolithicExpressions),
      }, {
        ...arbitraryPaperExpression(),
        expressionDoi: monolithicExpression.expressionDoi,
        server: O.some(serverWithMonolithicExpressions),
      }, {
        ...arbitraryPaperExpression(),
        expressionDoi: monolithicExpression.expressionDoi,
        server: O.some(serverWithMonolithicExpressions),
      },
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
