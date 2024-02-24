import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constructFrontMatter } from '../../src/read-side/construct-front-matter.js';
import { ExpressionFrontMatter } from '../../src/types/expression-front-matter.js';
import * as PH from '../../src/types/publishing-history.js';
import { createTestFramework, TestFramework } from '../framework/index.js';
import { shouldNotBeCalled } from '../should-not-be-called.js';
import { arbitrarySanitisedHtmlFragment } from '../helpers.js';
import { arbitraryPaperExpression } from '../types/paper-expression.helper.js';
import { ExpressionDoi } from '../../src/types/expression-doi.js';
import * as DE from '../../src/types/data-error.js';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper.js';
import { ExternalQueries } from '../../src/third-parties/index.js';

describe('construct-front-matter', () => {
  const latestExpressionDoi = arbitraryExpressionDoi();
  const latestExpressionFrontMatter: ExpressionFrontMatter = {
    abstract: O.some(arbitrarySanitisedHtmlFragment()),
    title: arbitrarySanitisedHtmlFragment(),
    authors: O.none,
  };
  let framework: TestFramework;
  let dependencies: ExternalQueries;

  beforeEach(() => {
    framework = createTestFramework();
    dependencies = {
      ...framework.dependenciesForViews,
      fetchExpressionFrontMatter: (expressionDoi: ExpressionDoi) => {
        if (expressionDoi === latestExpressionDoi) {
          return TE.right(latestExpressionFrontMatter);
        }
        return TE.left(DE.notFound);
      },
    };
  });

  describe('given a publishing history of multiple expressions', () => {
    let frontMatter: ExpressionFrontMatter;

    describe('when the latest expression is a preprint', () => {
      beforeEach(async () => {
        const history = pipe(
          [
            {
              ...arbitraryPaperExpression(),
              expressionType: 'preprint',
              publishedAt: new Date('1999-06-17'),
            },
            {
              ...arbitraryPaperExpression(),
              expressionDoi: latestExpressionDoi,
              expressionType: 'preprint',
              publishedAt: new Date('2022-06-17'),
            },
          ],
          PH.fromExpressions,
          E.getOrElseW(shouldNotBeCalled),
        );
        frontMatter = await pipe(
          history,
          constructFrontMatter(dependencies),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('constructs the front matter for the latest expression', () => {
        expect(frontMatter).toStrictEqual(latestExpressionFrontMatter);
      });
    });

    describe('when the latest expression is a journal article', () => {
      beforeEach(async () => {
        const history = pipe(
          [
            {
              ...arbitraryPaperExpression(),
              expressionType: 'preprint',
              publishedAt: new Date('1999-06-17'),
            },
            {
              ...arbitraryPaperExpression(),
              expressionDoi: latestExpressionDoi,
              expressionType: 'journal-article',
              publishedAt: new Date('2022-06-17'),
            },
          ],
          PH.fromExpressions,
          E.getOrElseW(shouldNotBeCalled),
        );
        frontMatter = await pipe(
          history,
          constructFrontMatter(dependencies),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('constructs the front matter for the latest expression', () => {
        expect(frontMatter).toStrictEqual(latestExpressionFrontMatter);
      });
    });
  });
});
