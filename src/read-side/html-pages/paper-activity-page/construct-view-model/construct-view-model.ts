import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructContainingList } from './construct-containing-list';
import { constructRelatedArticles } from './construct-related-articles';
import { constructUserListManagement } from './construct-user-list-management';
import { Dependencies } from './dependencies';
import { feedSummary } from './feed-summary';
import { getFeedItemsByDateDescending } from './get-feed-items-by-date-descending';
import * as DE from '../../../../types/data-error';
import { CanonicalExpressionDoi, ExpressionDoi } from '../../../../types/expression-doi';
import { ExpressionFrontMatter } from '../../../../types/expression-front-matter';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { UserId } from '../../../../types/user-id';
import { constructFrontMatter } from '../../../construct-front-matter';
import { constructCurationStatements } from '../../../curation-statements';
import { findAllListsContainingPaper } from '../../../find-all-lists-containing-paper';
import { constructReviewingGroups } from '../../../reviewing-groups';
import { detectLanguage } from '../../shared-components/lang-attribute';
import { ViewModel } from '../view-model';

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
