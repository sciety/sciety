import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import { feedSummary } from './feed-summary';
import {
  getArticleFeedEventsByDateDescending,
} from './get-article-feed-events';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { UserId } from '../../../types/user-id';
import { constructListedIn } from './construct-listed-in';
import { constructUserListManagement } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { constructCurationStatements } from './construct-curation-statements';
import { Dependencies } from './dependencies';

export type Params = {
  doi: Doi,
  user: O.Option<{ id: UserId }>,
};

export type Ports = Dependencies;

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.fetchArticle(params.doi),
  TE.chainW((articleDetails) => pipe(
    {
      feedItemsByDateDescending: getArticleFeedEventsByDateDescending(ports)(params.doi, articleDetails.server),
      relatedArticles: constructRelatedArticles(params.doi, ports),
    },
    sequenceS(T.ApplyPar),
    TE.rightTask,
    TE.map(({ feedItemsByDateDescending, relatedArticles }) => ({
      ...articleDetails,
      titleLanguageCode: detectLanguage(articleDetails.title),
      abstractLanguageCode: detectLanguage(articleDetails.abstract),
      userListManagement: constructUserListManagement(params.user, ports, params.doi),
      fullArticleUrl: `https://doi.org/${params.doi.value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(ports)(params.doi),
      relatedArticles,
      curationStatements: constructCurationStatements(ports, params.doi),
    })),
  )),
);
