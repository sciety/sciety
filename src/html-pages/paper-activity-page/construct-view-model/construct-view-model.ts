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
import { ExpressionFrontMatter } from '../../../third-parties/external-queries';
import { ExpressionDoi, expressionDoiCodec } from '../../../types/expression-doi';

export const paramsCodec = t.type({
  expressionDoi: expressionDoiCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof paramsCodec>;

const toExpressionFullTextHref = (expressionDoi: ExpressionDoi) => `https://doi.org/${expressionDoi}`;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const constructRemainingViewModel = (
  dependencies: Dependencies,
  params: Params,
) => (frontMatter: ExpressionFrontMatter) => pipe(
  dependencies.findAllExpressionsOfPaper(params.expressionDoi),
  TE.filterOrElseW(
    (expressions) => expressions.length > 0,
    () => DE.notFound,
  ),
  TE.map((foundExpressions) => {
    if (foundExpressions.length === 0) {
      dependencies.logger('error', 'findAllExpressionsOfPaper returned an empty array', { params });
    }
    return foundExpressions;
  }),
  TE.chainTaskK((foundExpressions) => pipe(
    {
      feedItemsByDateDescending: (
        getArticleFeedEventsByDateDescending(dependencies)(frontMatter.server, foundExpressions)
      ),
      relatedArticles: constructRelatedArticles(params.expressionDoi, dependencies),
      curationStatements: pipe(
        foundExpressions,
        RA.map((expression) => expression.expressionDoi),
        constructCurationStatements(dependencies),
      ),
    },
    sequenceS(T.ApplyPar),
  )),
  TE.map(({ curationStatements, feedItemsByDateDescending, relatedArticles }) => ({
    ...frontMatter,
    titleLanguageCode: detectLanguage(frontMatter.title),
    abstractLanguageCode: detectLanguage(frontMatter.abstract),
    userListManagement: constructUserListManagement(params.user, dependencies, params.expressionDoi),
    expressionFullTextHref: toExpressionFullTextHref(params.expressionDoi),
    feedItemsByDateDescending,
    ...feedSummary(feedItemsByDateDescending),
    listedIn: constructListedIn(dependencies)(params.expressionDoi),
    relatedArticles,
    curationStatements: pipe(
      curationStatements,
      RA.map((curationStatementWithGroupAndContent) => ({
        ...curationStatementWithGroupAndContent,
        fullText: curationStatementWithGroupAndContent.statement,
        fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
      })),
    ),
    reviewingGroups: constructReviewingGroups(dependencies, params.expressionDoi),
  })),
);

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.expressionDoi,
  dependencies.fetchExpressionFrontMatter,
  TE.chainW(constructRemainingViewModel(dependencies, params)),
);
