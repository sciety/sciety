import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import { feedSummary } from './feed-summary';
import { getArticleFeedEventsByDateDescending } from './get-article-feed-events';
import * as DE from '../../../types/data-error';
import { ArticleId } from '../../../types/article-id';
import { ViewModel } from '../view-model';
import { UserId } from '../../../types/user-id';
import { constructListedIn } from './construct-listed-in';
import { constructUserListManagement } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { constructCurationStatements } from '../../../shared-components/curation-statements';
import { Dependencies } from './dependencies';
import { constructReviewingGroups } from '../../../shared-components/reviewing-groups';
import { DoiOfArticleExpression } from '../../../types/doi-of-article-expression';

type Params = {
  articleId: ArticleId,
  user: O.Option<{ id: UserId }>,
};

const findExpressionOfArticleAsDoi = (articleId: ArticleId): DoiOfArticleExpression => {
  if (articleId.value.startsWith('uuid:')) {
    return new DoiOfArticleExpression('10.1099/acmi.0.000530.v1');
  }
  return articleId;
};

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.articleId,
  findExpressionOfArticleAsDoi,
  dependencies.fetchArticle,
  TE.chainW((articleDetails) => pipe(
    {
      feedItemsByDateDescending: getArticleFeedEventsByDateDescending(dependencies)(
        params.articleId, articleDetails.server,
      ),
      relatedArticles: constructRelatedArticles(params.articleId, dependencies),
      curationStatements: constructCurationStatements(dependencies, params.articleId),
    },
    sequenceS(T.ApplyPar),
    TE.rightTask,
    TE.map(({ curationStatements, feedItemsByDateDescending, relatedArticles }) => ({
      ...articleDetails,
      titleLanguageCode: detectLanguage(articleDetails.title),
      abstractLanguageCode: detectLanguage(articleDetails.abstract),
      userListManagement: constructUserListManagement(params.user, dependencies, params.articleId),
      fullArticleUrl: `https://doi.org/${findExpressionOfArticleAsDoi(params.articleId).value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(dependencies)(params.articleId),
      relatedArticles,
      curationStatements: pipe(
        curationStatements,
        RA.map((curationStatementWithGroupAndContent) => ({
          ...curationStatementWithGroupAndContent,
          fullText: curationStatementWithGroupAndContent.statement,
          fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
        })),
      ),
      reviewingGroups: constructReviewingGroups(dependencies, params.articleId),
    })),
  )),
);
