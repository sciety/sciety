import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { CurationStatementViewModel, constructCurationStatements } from '../curation-statements';
import { ErrorViewModel } from './render-error-as-html';
import { fetchArticleDetails } from './fetch-article-details';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { ViewModel } from './view-model';
import { constructReviewingGroups } from '../reviewing-groups';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../types/expression-doi';
import * as DE from '../../types/data-error';
import * as PH from '../../types/publishing-history';

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
  ports: Dependencies,
) => (inputExpressionDoi: ExpressionDoi): TE.TaskEither<ErrorViewModel, ViewModel> => pipe(
  inputExpressionDoi,
  ports.fetchPublishingHistory,
  TE.chain((publishingHistory) => pipe(
    inputExpressionDoi,
    fetchArticleDetails(ports, publishingHistory),
    TE.map(
      (expressionDetails) => ({
        ...expressionDetails,
        latestVersionDate: O.some(expressionDetails.latestVersionDate),
        inputExpressionDoi,
        articleActivity: ports.getActivityForExpressionDoi(inputExpressionDoi),
        publishingHistory,
      }),
    ),
  )),
  TE.mapLeft(toErrorViewModel(inputExpressionDoi)),
  TE.chainW((partial) => pipe(
    [inputExpressionDoi],
    constructCurationStatements(ports),
    T.map((curationStatements) => ({
      inputExpressionDoi: partial.inputExpressionDoi,
      paperActivityPageHref: pipe(
        partial.publishingHistory,
        PH.getLatestExpression,
        (expression) => expression.expressionDoi,
        constructPaperActivityPageHref,
      ),
      title: partial.title,
      authors: partial.authors,
      latestPublishedAt: partial.latestVersionDate,
      latestActivityAt: partial.articleActivity.latestActivityAt,
      evaluationCount: pipe(
        partial.articleActivity.evaluationCount === 0,
        B.fold(
          () => O.some(partial.articleActivity.evaluationCount),
          () => O.none,
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
      reviewingGroups: constructReviewingGroups(ports, inputExpressionDoi),
    })),
    TE.rightTask,
  )),
);
