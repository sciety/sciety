import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CurationStatementViewModel, constructCurationStatements } from '../curation-statements';
import { ErrorViewModel } from './render-error-as-html';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { ViewModel } from './view-model';
import { constructReviewingGroups } from '../reviewing-groups';
import * as DE from '../../types/data-error';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';
import { constructFrontMatter } from '../../read-side/construct-front-matter';
import { constructEvaluationHistory } from '../../read-side/construct-evaluation-history';

const transformIntoCurationStatementViewModel = (
  curationStatement: CurationStatementViewModel,
): ViewModel['curationStatementsTeasers'][number] => ({
  groupPageHref: curationStatement.groupPageHref,
  groupName: curationStatement.groupName,
  quote: sanitise(toHtmlFragment(curationStatement.statement)),
  quoteLanguageCode: curationStatement.statementLanguageCode,
});

const constructPaperActivityPageHref = (expressionDoi: ExpressionDoi) => `/articles/activity/${expressionDoi}`;

const toErrorViewModel = (inputExpressionDoi: ExpressionDoi) => (error: DE.DataError) => ({
  inputExpressionDoi,
  href: `/articles/${inputExpressionDoi}`,
  error,
});

export const constructViewModel = (
  dependencies: Dependencies,
) => (inputExpressionDoi: ExpressionDoi): TE.TaskEither<ErrorViewModel, ViewModel> => pipe(
  inputExpressionDoi,
  dependencies.fetchPublishingHistory,
  TE.chain((publishingHistory) => pipe(
    constructFrontMatter(dependencies, publishingHistory),
    TE.map((expressionFrontMatter) => ({
      inputExpressionDoi,
      expressionFrontMatter,
      articleActivity: dependencies.getActivityForExpressionDoi(inputExpressionDoi),
      publishingHistory,
    })),
  )),
  TE.mapLeft(toErrorViewModel(inputExpressionDoi)),
  TE.chainW((partial) => pipe(
    [inputExpressionDoi],
    constructCurationStatements(dependencies),
    T.map((curationStatements) => ({
      inputExpressionDoi: partial.inputExpressionDoi,
      paperActivityPageHref: pipe(
        partial.publishingHistory,
        PH.getLatestExpression,
        (expression) => expression.expressionDoi,
        constructPaperActivityPageHref,
      ),
      title: partial.expressionFrontMatter.title,
      authors: partial.expressionFrontMatter.authors,
      latestPublishedAt: pipe(
        partial.publishingHistory,
        PH.getLatestExpression,
        (expression) => expression.publishedAt,
        O.some,
      ),
      latestActivityAt: partial.articleActivity.latestActivityAt,
      evaluationCount: pipe(
        constructEvaluationHistory(dependencies, partial.publishingHistory),
        RA.match(
          () => O.none,
          (evaluations) => O.some(evaluations.length),
        ),
      ),
      listMembershipCount: pipe(
        partial.articleActivity.listMembershipCount === 0,
        B.fold(
          () => O.some(partial.articleActivity.listMembershipCount),
          () => O.none,
        ),
      ),
      curationStatementsTeasers: pipe(
        curationStatements,
        RA.map(transformIntoCurationStatementViewModel),
      ),
      reviewingGroups: constructReviewingGroups(dependencies, inputExpressionDoi),
    })),
    TE.rightTask,
  )),
);
