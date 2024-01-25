import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constructFrontMatter } from '../../src/read-side/construct-front-matter';
import { ExpressionFrontMatter } from '../../src/types/expression-front-matter';
import * as PH from '../../src/types/publishing-history';
import { createTestFramework, TestFramework } from '../framework';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitrarySanitisedHtmlFragment } from '../helpers';
import { arbitraryPaperExpression } from '../types/paper-expression.helper';
import { ExpressionDoi } from '../../src/types/expression-doi';
import * as DE from '../../src/types/data-error';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

describe('construct-front-matter', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('given a publishing history of multiple expressions', () => {
    describe('when the latest expression is a preprint', () => {
      const latestExpressionDoi = arbitraryExpressionDoi();
      const latestExpressionFrontMatter: ExpressionFrontMatter = {
        abstract: O.some(arbitrarySanitisedHtmlFragment()),
        title: arbitrarySanitisedHtmlFragment(),
        authors: O.none,
      };
      let frontMatter: ExpressionFrontMatter;

      beforeEach(async () => {
        const history = pipe(
          [
            {
              ...arbitraryPaperExpression(),
              expressionType: 'preprint',
              publishedAt: new Date(1999, 5, 17),
            },
            {
              ...arbitraryPaperExpression(),
              expressionDoi: latestExpressionDoi,
              expressionType: 'preprint',
              publishedAt: new Date(2022, 5, 17),
            },
          ],
          PH.fromExpressions,
          E.getOrElseW(shouldNotBeCalled),
        );
        const dependencies = {
          ...framework.dependenciesForViews,
          fetchExpressionFrontMatter: (expressionDoi: ExpressionDoi) => {
            if (expressionDoi === latestExpressionDoi) {
              return TE.right(latestExpressionFrontMatter);
            }
            return TE.left(DE.notFound);
          },
        };
        frontMatter = await pipe(
          constructFrontMatter(dependencies, history),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('constructs the front matter for the latest expression', () => {
        expect(frontMatter).toStrictEqual(latestExpressionFrontMatter);
      });
    });

    describe('when the latest expression is a journal article', () => {
      const latestExpressionDoi = arbitraryExpressionDoi();
      const latestExpressionFrontMatter: ExpressionFrontMatter = {
        abstract: O.some(arbitrarySanitisedHtmlFragment()),
        title: arbitrarySanitisedHtmlFragment(),
        authors: O.none,
      };
      let frontMatter: ExpressionFrontMatter;

      beforeEach(async () => {
        const history = pipe(
          [
            {
              ...arbitraryPaperExpression(),
              expressionType: 'preprint',
              publishedAt: new Date(1999, 5, 17),
            },
            {
              ...arbitraryPaperExpression(),
              expressionDoi: latestExpressionDoi,
              expressionType: 'journal-article',
              publishedAt: new Date(2022, 5, 17),
            },
          ],
          PH.fromExpressions,
          E.getOrElseW(shouldNotBeCalled),
        );
        const dependencies = {
          ...framework.dependenciesForViews,
          fetchExpressionFrontMatter: (expressionDoi: ExpressionDoi) => {
            if (expressionDoi === latestExpressionDoi) {
              return TE.right(latestExpressionFrontMatter);
            }
            return TE.left(DE.notFound);
          },
        };
        frontMatter = await pipe(
          constructFrontMatter(dependencies, history),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('constructs the front matter for the latest expression', () => {
        expect(frontMatter).toStrictEqual(latestExpressionFrontMatter);
      });
    });
  });
});
