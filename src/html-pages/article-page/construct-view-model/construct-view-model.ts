import * as O from 'fp-ts/Option';
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
import { ArticleId } from '../../../types/article-id';
import { toHtmlFragment } from '../../../types/html-fragment';
import { sanitise } from '../../../types/sanitised-html-fragment';

const fetchArticle = (dependencies: Dependencies): Dependencies['fetchArticle'] => (articleId) => {
  if (articleId.value === '10.1099-acmi.0.000569.v1') {
    return TE.right({
      abstract: sanitise(toHtmlFragment('Nocardia are gram-positive bacilli that cause opportunistic infections in susceptible populations. We describe a case of post-transplant infection of pulmonary Nocardiosis caused by the rare strain Nocardia cyriacigeorgica and the challenges faced in reaching a definitive diagnosis. This case report emphasizes on keeping Nocardiosis as a differential diagnosis in transplant recipients as this disease is largely underdiagnosed and underreported.')),
      authors: O.some([
        'NAGESWARI GANDHAM',
        'Sriram Kannuri',
        'Aryan Gupta',
        'Sahjid Mukhida',
        'NIKUNJA DAS',
        'Shahzad Mirza',
      ]),
      doi: articleId,
      title: sanitise(toHtmlFragment('A post-transplant infection by Nocardia cyriacigeorgica')),
      server: 'microbiologyresearch',
    });
  }
  return dependencies.fetchArticle(articleId);
};

export const articlePageParams = t.type({
  doi: t.string,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type Params = t.TypeOf<typeof articlePageParams>;

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  new ArticleId(params.doi),
  fetchArticle(dependencies),
  TE.chainW((articleDetails) => pipe(
    {
      feedItemsByDateDescending: getArticleFeedEventsByDateDescending(dependencies)(
        new ArticleId(params.doi),
        articleDetails.server,
      ),
      relatedArticles: constructRelatedArticles(new ArticleId(params.doi), dependencies),
      curationStatements: constructCurationStatements(dependencies, new ArticleId(params.doi)),
    },
    sequenceS(T.ApplyPar),
    TE.rightTask,
    TE.map(({ curationStatements, feedItemsByDateDescending, relatedArticles }) => ({
      ...articleDetails,
      titleLanguageCode: detectLanguage(articleDetails.title),
      abstractLanguageCode: detectLanguage(articleDetails.abstract),
      userListManagement: constructUserListManagement(params.user, dependencies, new ArticleId(params.doi)),
      fullArticleUrl: `https://doi.org/${params.doi.replace(/-/, '/')}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(dependencies)(new ArticleId(params.doi)),
      relatedArticles,
      curationStatements: pipe(
        curationStatements,
        RA.map((curationStatementWithGroupAndContent) => ({
          ...curationStatementWithGroupAndContent,
          fullText: curationStatementWithGroupAndContent.statement,
          fullTextLanguageCode: curationStatementWithGroupAndContent.statementLanguageCode,
        })),
      ),
      reviewingGroups: constructReviewingGroups(dependencies, new ArticleId(params.doi)),
    })),
  )),
);
