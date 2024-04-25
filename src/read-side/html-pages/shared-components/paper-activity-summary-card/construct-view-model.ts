import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ErrorViewModel } from './render-error-as-html';
import { ViewModel } from './view-model';
import * as DE from '../../../../types/data-error';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { toHtmlFragment } from '../../../../types/html-fragment';
import * as PH from '../../../../types/publishing-history';
import { sanitise } from '../../../../types/sanitised-html-fragment';
import { constructEvaluationHistory } from '../../../construct-evaluation-history';
import { constructFrontMatter } from '../../../construct-front-matter';
import { CurationStatement, constructCurationStatements } from '../../../curation-statements';
import { findAllListsContainingPaper } from '../../../find-all-lists-containing-paper';
import { constructPaperActivityPageHref } from '../../../paths';
import { constructReviewingGroups } from '../../../reviewing-groups';

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
