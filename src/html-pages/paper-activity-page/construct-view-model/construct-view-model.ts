import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { feedSummary } from './feed-summary';
import { getArticleFeedEventsByDateDescending } from './get-article-feed-events';
import * as DE from '../../../types/data-error';
import { articleIdCodec } from '../../../types/article-id';
import { ViewModel } from '../view-model';
import { userIdCodec } from '../../../types/user-id';
import { constructListedIn } from './construct-listed-in';
import { constructUserListManagement } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { constructCurationStatements } from '../../../shared-components/curation-statements';
import { Dependencies } from './dependencies';
import { constructReviewingGroups } from '../../../shared-components/reviewing-groups';

export const paramsCodec = t.type({
  doi: articleIdCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof paramsCodec>;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.fetchArticle(params.doi),
  TE.chainW((articleDetails) => pipe(
    {
      feedItemsByDateDescending: getArticleFeedEventsByDateDescending(dependencies)(params.doi, articleDetails.server),
      relatedArticles: constructRelatedArticles(params.doi, dependencies),
      curationStatements: constructCurationStatements(dependencies, params.doi),
    },
    sequenceS(T.ApplyPar),
    TE.rightTask,
    TE.map(({ curationStatements, feedItemsByDateDescending, relatedArticles }) => ({
      ...articleDetails,
      titleLanguageCode: detectLanguage(articleDetails.title),
      abstractLanguageCode: detectLanguage(articleDetails.abstract),
      userListManagement: constructUserListManagement(params.user, dependencies, params.doi),
      fullArticleUrl: `https://doi.org/${params.doi.value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(dependencies)(params.doi),
      relatedArticles,
      curationStatements: pipe(
        curationStatements,
        RA.map((curationStatementWithGroupAndContent) => ({
          ...curationStatementWithGroupAndContent,
          fullText: curationStatementWithGroupAndContent.statement,
          fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
        })),
      ),
      reviewingGroups: constructReviewingGroups(dependencies, params.doi),
    })),
  )),
);
