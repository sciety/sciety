import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { CurationStatementViewModel, constructCurationStatements } from '../curation-statements';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { fetchArticleDetails } from './fetch-article-details';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { ViewModel } from './view-model';
import { constructReviewingGroups } from '../reviewing-groups';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../types/expression-doi';

const transformIntoCurationStatementViewModel = (
  curationStatement: CurationStatementViewModel,
): ViewModel['curationStatementsTeasers'][number] => ({
  groupPageHref: curationStatement.groupPageHref,
  groupName: curationStatement.groupName,
  quote: sanitise(toHtmlFragment(curationStatement.statement)),
  quoteLanguageCode: curationStatement.statementLanguageCode,
});

const constructPaperActivityPageHref = (expressionDoi: ExpressionDoi) => `/articles/activity/${expressionDoi}`;

export const constructArticleCard = (
  ports: Dependencies,
) => (inputExpressionDoi: ExpressionDoi): TE.TaskEither<ArticleErrorCardViewModel, ViewModel> => pipe(
  ports.getActivityForExpressionDoi(inputExpressionDoi),
  (expressionActivity) => pipe(
    inputExpressionDoi,
    fetchArticleDetails(ports),
    TE.bimap(
      (error) => ({
        ...expressionActivity,
        inputExpressionDoi,
        href: `/articles/${inputExpressionDoi}`,
        error,
      }),
      (expressionDetails) => ({
        ...expressionDetails,
        inputExpressionDoi,
        articleActivity: expressionActivity,
      }),
    ),
  ),
  TE.chainW((partial) => pipe(
    constructCurationStatements(ports, inputExpressionDoi),
    T.map((curationStatements) => ({
      inputExpressionDoi: partial.inputExpressionDoi,
      paperActivityPageHref: constructPaperActivityPageHref(partial.inputExpressionDoi),
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
