import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { feedSummary } from './feed-summary.js';
import { getFeedItemsByDateDescending } from './get-feed-items-by-date-descending.js';
import * as DE from '../../../types/data-error.js';
import { ViewModel } from '../view-model.js';
import { UserId } from '../../../types/user-id.js';
import { constructUserListManagement } from './construct-user-list-management.js';
import { constructRelatedArticles } from './construct-related-articles.js';
import { detectLanguage } from '../../../shared-components/lang-attribute/index.js';
import { constructCurationStatements } from '../../../read-side/curation-statements/index.js';
import { Dependencies } from './dependencies.js';
import { constructReviewingGroups } from '../../../read-side/reviewing-groups/index.js';
import { CanonicalExpressionDoi, ExpressionDoi } from '../../../types/expression-doi.js';
import { ExpressionFrontMatter } from '../../../types/expression-front-matter.js';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { constructFrontMatter } from '../../../read-side/construct-front-matter.js';
import { constructContainingList } from './construct-containing-list.js';
import { findAllListsContainingPaper } from '../../../read-side/find-all-lists-containing-paper.js';

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
  latestExpressionDoi: CanonicalExpressionDoi,
  user: O.Option<{ id: UserId }>,
};

type ConstructViewModel = (
  dependencies: Dependencies
) => (
  params: Params
) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.latestExpressionDoi,
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
    userListManagement: constructUserListManagement(params.user, dependencies, params.latestExpressionDoi),
    expressionFullTextHref: toExpressionFullTextHref(params.latestExpressionDoi),
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
