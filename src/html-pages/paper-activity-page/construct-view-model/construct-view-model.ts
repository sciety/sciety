import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as O from 'fp-ts/Option';
import { feedSummary } from './feed-summary';
import { getFeedItemsByDateDescending } from './get-feed-items-by-date-descending';
import * as DE from '../../../types/data-error';
import { ViewModel } from '../view-model';
import { userIdCodec } from '../../../types/user-id';
import { constructListedIn } from './construct-listed-in';
import { constructUserListManagement } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { constructCurationStatements } from '../../../read-side/curation-statements';
import { Dependencies } from './dependencies';
import { constructReviewingGroups } from '../../../shared-components/reviewing-groups';
import { ExpressionDoi, expressionDoiCodec } from '../../../types/expression-doi';
import { ExpressionFrontMatter } from '../../../types/expression-front-matter';
import { toHtmlFragment } from '../../../types/html-fragment';
import * as PH from '../../../types/publishing-history';
import { constructFrontMatter } from '../../../read-side/construct-front-matter';

export const paramsCodec = t.type({
  expressionDoi: expressionDoiCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof paramsCodec>;

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

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.expressionDoi,
  dependencies.fetchPublishingHistory,
  TE.chain((history) => pipe(
    {
      frontMatter: constructFrontMatter(dependencies, history),
      feedItemsByDateDescending: pipe(
        history,
        getFeedItemsByDateDescending(dependencies),
        TE.rightTask,
      ),
      relatedArticles: pipe(
        PH.getLatestPreprintExpression(history),
        (expression) => constructRelatedArticles(expression.expressionDoi, dependencies),
        TE.rightTask,
      ),
      curationStatements: pipe(
        PH.getAllExpressionDois(history),
        constructCurationStatements(dependencies),
        TE.rightTask,
      ),
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
    listedIn: constructListedIn(dependencies)(params.expressionDoi),
    relatedArticles: partial.relatedArticles,
    curationStatements: pipe(
      partial.curationStatements,
      RA.map((curationStatementWithGroupAndContent) => ({
        ...curationStatementWithGroupAndContent,
        fullText: curationStatementWithGroupAndContent.statement,
        fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
      })),
    ),
    reviewingGroups: constructReviewingGroups(dependencies, params.expressionDoi),
  })),
);
