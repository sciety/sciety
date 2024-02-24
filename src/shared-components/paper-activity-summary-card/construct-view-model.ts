import * as D from 'fp-ts/Date';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CurationStatement, constructCurationStatements } from '../../read-side/curation-statements/index.js';
import { ErrorViewModel } from './render-error-as-html.js';
import { sanitise } from '../../types/sanitised-html-fragment.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { ViewModel } from './view-model.js';
import { constructReviewingGroups } from '../../read-side/reviewing-groups/index.js';
import * as DE from '../../types/data-error.js';
import { Dependencies } from './dependencies.js';
import { ExpressionDoi } from '../../types/expression-doi.js';
import * as PH from '../../types/publishing-history.js';
import { constructFrontMatter } from '../../read-side/construct-front-matter.js';
import { constructEvaluationHistory } from '../../read-side/construct-evaluation-history.js';
import { findAllListsContainingPaper } from '../../read-side/find-all-lists-containing-paper.js';
import { paperActivityPagePath } from '../../standards/index.js';

const transformIntoCurationStatementViewModel = (
  curationStatement: CurationStatement,
): ViewModel['curationStatementsTeasers'][number] => ({
  groupPageHref: curationStatement.groupPageHref,
  groupName: curationStatement.groupName,
  quote: sanitise(toHtmlFragment(curationStatement.statement)),
  quoteLanguageCode: curationStatement.statementLanguageCode,
});

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
        paperActivityPagePath,
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
