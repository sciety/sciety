import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { URL } from 'url';
import {
  GetExpressionsFromBiorxiv,
  replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes,
} from '../../src/third-parties/replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';
import { PaperExpression } from '../../src/types/paper-expression';
import { arbitraryDate, arbitraryUri } from '../helpers';

describe('replace-one-monolithic-biorxiv-or-medrxiv-expression-with-granular-ones', () => {
  describe('given a monolithic expression encapsulating three expressions', () => {
    const serverWithMonolithicExpressions = 'biorxiv';
    const monolithicExpression: PaperExpression = {
      expressionDoi: arbitraryExpressionDoi(),
      publisherHtmlUrl: new URL(arbitraryUri()),
      publishedAt: arbitraryDate(),
      server: O.some(serverWithMonolithicExpressions),
    };
    const getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv = () => TE.right([
      {
        expressionDoi: monolithicExpression.expressionDoi,
        publisherHtmlUrl: new URL(arbitraryUri()),
        publishedAt: arbitraryDate(),
        server: O.some(serverWithMonolithicExpressions),
      }, {
        expressionDoi: monolithicExpression.expressionDoi,
        publisherHtmlUrl: new URL(arbitraryUri()),
        publishedAt: arbitraryDate(),
        server: O.some(serverWithMonolithicExpressions),
      }, {
        expressionDoi: monolithicExpression.expressionDoi,
        publisherHtmlUrl: new URL(arbitraryUri()),
        publishedAt: arbitraryDate(),
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
