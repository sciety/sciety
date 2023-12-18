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
import { ViewModel } from '../view-model';
import { userIdCodec } from '../../../types/user-id';
import { constructListedIn } from './construct-listed-in';
import { constructUserListManagement } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { constructCurationStatements } from '../../../shared-components/curation-statements';
import { Dependencies } from './dependencies';
import { constructReviewingGroups } from '../../../shared-components/reviewing-groups';
import { PaperExpressionLocator, PaperId } from '../../../third-parties';
import { PaperExpressionFrontMatter } from '../../../third-parties/external-queries';
import { PaperIdThatIsADoi } from '../../../third-parties/paper-id';
import { ExpressionDoi, expressionDoiCodec } from '../../../types/expression-doi';

export const paramsCodec = t.type({
  expressionDoi: expressionDoiCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof paramsCodec>;

const toFullArticleUrl = (paperId: PaperId.PaperIdThatIsADoi) => `https://doi.org/${PaperId.getDoiPortion(paperId)}`;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const getFrontMatterForMostRecentExpression = (dependencies: Dependencies) => (expressionDoi: ExpressionDoi): ReturnType<Dependencies['fetchPaperExpressionFrontMatter']> => pipe(
  expressionDoi,
  PaperExpressionLocator.fromDoi,
  dependencies.fetchPaperExpressionFrontMatter,
);

const constructRemainingViewModelForDoi = (
  dependencies: Dependencies,
  params: Params,
  paperId: PaperIdThatIsADoi,
) => (frontMatter: PaperExpressionFrontMatter) => pipe(
  {
    feedItemsByDateDescending: getArticleFeedEventsByDateDescending(dependencies)(paperId, frontMatter.server),
    relatedArticles: constructRelatedArticles(frontMatter.doi, dependencies),
    curationStatements: constructCurationStatements(dependencies, frontMatter.doi),
  },
  sequenceS(T.ApplyPar),
  TE.rightTask,
  TE.map(({ curationStatements, feedItemsByDateDescending, relatedArticles }) => ({
    ...frontMatter,
    titleLanguageCode: detectLanguage(frontMatter.title),
    abstractLanguageCode: detectLanguage(frontMatter.abstract),
    userListManagement: constructUserListManagement(params.user, dependencies, frontMatter.doi),
    fullArticleUrl: toFullArticleUrl(paperId),
    feedItemsByDateDescending,
    ...feedSummary(feedItemsByDateDescending),
    listedIn: constructListedIn(dependencies)(frontMatter.doi),
    relatedArticles,
    curationStatements: pipe(
      curationStatements,
      RA.map((curationStatementWithGroupAndContent) => ({
        ...curationStatementWithGroupAndContent,
        fullText: curationStatementWithGroupAndContent.statement,
        fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
      })),
    ),
    reviewingGroups: constructReviewingGroups(dependencies, frontMatter.doi),
  })),
);

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.expressionDoi,
  getFrontMatterForMostRecentExpression(dependencies),
  TE.chainW(constructRemainingViewModelForDoi(dependencies, params, `doi:${params.expressionDoi}` as PaperIdThatIsADoi)),
);
