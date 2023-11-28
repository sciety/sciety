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

type PaperIdBrand = {
  readonly PaperId: unique symbol,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paperIdCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, PaperIdBrand> => input.length > 0,
  'PaperId',
);

export type PaperId = t.TypeOf<typeof paperIdCodec>;

export const paramsCodec = t.type({
  paperId: paperIdCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof paramsCodec>;

const toFullArticleUrl = (paperId: PaperId) => `https://doi.org/${paperId}`;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const toPaperExpressionDoi = (paperId: PaperId) => pipe(
  paperId,
  articleIdCodec.decode,
  TE.fromEither,
  TE.mapLeft(() => DE.unavailable),
);

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.paperId,
  toPaperExpressionDoi,
  TE.chain(dependencies.fetchArticle),
  TE.chainW((articleDetails) => pipe(
    {
      feedItemsByDateDescending: (
        getArticleFeedEventsByDateDescending(dependencies)(articleDetails.doi, articleDetails.server)
      ),
      relatedArticles: constructRelatedArticles(articleDetails.doi, dependencies),
      curationStatements: constructCurationStatements(dependencies, articleDetails.doi),
    },
    sequenceS(T.ApplyPar),
    TE.rightTask,
    TE.map(({ curationStatements, feedItemsByDateDescending, relatedArticles }) => ({
      ...articleDetails,
      titleLanguageCode: detectLanguage(articleDetails.title),
      abstractLanguageCode: detectLanguage(articleDetails.abstract),
      userListManagement: constructUserListManagement(params.user, dependencies, articleDetails.doi),
      fullArticleUrl: pipe(
        params.paperId,
        toFullArticleUrl,
      ),
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(dependencies)(articleDetails.doi),
      relatedArticles,
      curationStatements: pipe(
        curationStatements,
        RA.map((curationStatementWithGroupAndContent) => ({
          ...curationStatementWithGroupAndContent,
          fullText: curationStatementWithGroupAndContent.statement,
          fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
        })),
      ),
      reviewingGroups: constructReviewingGroups(dependencies, articleDetails.doi),
    })),
  )),
);
