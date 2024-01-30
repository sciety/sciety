import * as D from 'fp-ts/Date';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CurationStatement, constructCurationStatements } from '../../read-side/curation-statements';
import { ErrorViewModel } from './render-error-as-html';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { ViewModel } from './view-model';
import { constructReviewingGroups } from '../../read-side/reviewing-groups';
import * as DE from '../../types/data-error';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';
import { constructFrontMatter } from '../../read-side/construct-front-matter';
import { constructEvaluationHistory } from '../../read-side/construct-evaluation-history';
import { findAllListsContainingPaper } from '../../read-side/find-all-lists-containing-paper';

const transformIntoCurationStatementViewModel = (
  curationStatement: CurationStatement,
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
    publishingHistory,
    constructFrontMatter(dependencies),
    TE.map((expressionFrontMatter) => ({
      expressionFrontMatter,
      publishingHistory,
      evaluationHistory: constructEvaluationHistory(dependencies, publishingHistory),
    })),
  )),
  TE.chainTaskK((partial) => pipe(
    constructCurationStatements(dependencies, partial.publishingHistory),
    T.map((curationStatements) => ({
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
      ),
      latestActivityAt: pipe(
        partial.evaluationHistory,
        RA.map((evaluation) => evaluation.publishedAt),
        RA.sort(D.Ord),
        RA.last,
      ),
      evaluationCount: pipe(
        partial.evaluationHistory,
        RA.match(
          () => O.none,
          (evaluations) => O.some(evaluations.length),
        ),
      ),
      listMembershipCount: pipe(
        partial.publishingHistory,
        findAllListsContainingPaper(dependencies),
        RA.match(
          () => O.none,
          (lists) => O.some(lists.length),
        ),
      ),
      curationStatementsTeasers: pipe(
        curationStatements,
        RA.map(transformIntoCurationStatementViewModel),
      ),
      reviewingGroups: constructReviewingGroups(dependencies, partial.publishingHistory),

    })),
  )),
  TE.mapLeft(toErrorViewModel(inputExpressionDoi)),
);
