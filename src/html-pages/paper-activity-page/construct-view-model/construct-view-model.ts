import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { feedSummary } from './feed-summary';
import { getFeedItemsByDateDescending } from './get-feed-items-by-date-descending';
import * as DE from '../../../types/data-error';
import { ViewModel } from '../view-model';
import { UserId } from '../../../types/user-id';
import { constructUserListManagement } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { constructCurationStatements } from '../../../read-side/curation-statements';
import { Dependencies } from './dependencies';
import { constructReviewingGroups } from '../../../read-side/reviewing-groups';
import { CanonicalExpressionDoi, ExpressionDoi } from '../../../types/expression-doi';
import { ExpressionFrontMatter } from '../../../types/expression-front-matter';
import { toHtmlFragment } from '../../../types/html-fragment';
import { constructFrontMatter } from '../../../read-side/construct-front-matter';
import { constructContainingList } from './construct-containing-list';
import { findAllListsContainingPaper } from '../../../read-side/find-all-lists-containing-paper';

const toExpressionFullTextHref = (expressionDoi: ExpressionDoi) => `https://doi.org/${expressionDoi}`;

const constructAbstract = (abstract: ExpressionFrontMatter['abstract']) => pipe(
  abstract,
  O.matchW(
    () => ({
      abstract: toHtmlFragment('No abstract available'),
      abstractLanguageCode: O.none,
    }),
    (a) => ({
      abstract: a,
      abstractLanguageCode: detectLanguage(a),
    }),
  ),
);

type Params = {
  expressionDoi: CanonicalExpressionDoi,
  user: O.Option<{ id: UserId }>,
};

type ConstructViewModel = (
  dependencies: Dependencies
) => (
  params: Params
) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.expressionDoi,
  dependencies.fetchPublishingHistory,
  TE.chain((publishingHistory) => pipe(
    {
      frontMatter: pipe(
        publishingHistory,
        constructFrontMatter(dependencies),
      ),
      feedItemsByDateDescending: pipe(
        publishingHistory,
        getFeedItemsByDateDescending(dependencies),
        TE.rightTask,
      ),
      relatedArticles: pipe(
        constructRelatedArticles(publishingHistory, dependencies),
        TE.rightTask,
      ),
      curationStatements: pipe(
        constructCurationStatements(dependencies, publishingHistory),
        TE.rightTask,
      ),
      publishingHistory: TE.right(publishingHistory),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.map((partial) => ({
    ...partial.frontMatter,
    titleLanguageCode: detectLanguage(partial.frontMatter.title),
    ...constructAbstract(partial.frontMatter.abstract),
    userListManagement: constructUserListManagement(params.user, dependencies, params.expressionDoi),
    expressionFullTextHref: toExpressionFullTextHref(params.expressionDoi),
    feedItemsByDateDescending: partial.feedItemsByDateDescending,
    ...feedSummary(partial.feedItemsByDateDescending),
    listedIn: pipe(
      partial.publishingHistory,
      findAllListsContainingPaper(dependencies),
      RA.map(constructContainingList(dependencies)),
    ),
    relatedArticles: partial.relatedArticles,
    curationStatements: pipe(
      partial.curationStatements,
      RA.map((curationStatementWithGroupAndContent) => ({
        ...curationStatementWithGroupAndContent,
        fullText: curationStatementWithGroupAndContent.statement,
        fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
      })),
    ),
    reviewingGroups: constructReviewingGroups(dependencies, partial.publishingHistory),
  })),
);
