import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as O from 'fp-ts/Option';
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
import { ExpressionDoi, expressionDoiCodec } from '../../../types/expression-doi';
import { PaperExpression } from '../../../types/paper-expression';
import { ExpressionFrontMatter } from '../../../types/expression-front-matter';
import { toHtmlFragment } from '../../../types/html-fragment';

export const paramsCodec = t.type({
  expressionDoi: expressionDoiCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof paramsCodec>;

const toExpressionFullTextHref = (expressionDoi: ExpressionDoi) => `https://doi.org/${expressionDoi}`;

const byDateAscending: Ord.Ord<PaperExpression> = pipe(
  D.Ord,
  Ord.contramap((expression) => expression.publishedAt),
);

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
  dependencies.findAllExpressionsOfPaper,
  TE.filterOrElseW(
    (expressions) => expressions.length > 0,
    () => {
      dependencies.logger('error', 'findAllExpressionsOfPaper returned an empty array', { params });
      return DE.notFound;
    },
  ),
  TE.chain((foundExpressions) => pipe(
    {
      frontMatter: pipe(
        foundExpressions,
        RA.sort(byDateAscending),
        RA.last,
        TE.fromOption(() => DE.unavailable),
        TE.map((expression) => expression.expressionDoi),
        TE.chain(dependencies.fetchExpressionFrontMatter),
      ),
      feedItemsByDateDescending: pipe(
        getArticleFeedEventsByDateDescending(dependencies)(foundExpressions),
        TE.rightTask,
      ),
      relatedArticles: pipe(
        constructRelatedArticles(params.expressionDoi, dependencies),
        TE.rightTask,
      ),
      curationStatements: pipe(
        foundExpressions,
        RA.map((expression) => expression.expressionDoi),
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
