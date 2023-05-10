import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { detect } from 'tinyld';
import { sequenceS } from 'fp-ts/Apply';
import { feedSummary } from './feed-summary';
import {
  getArticleFeedEventsByDateDescending,
  Ports as GetArticleFeedEventsPorts,
} from './get-article-feed-events';
import { ArticleAuthors } from '../../../types/article-authors';
import { ArticleServer } from '../../../types/article-server';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';
import { ViewModel } from '../view-model';
import { UserId } from '../../../types/user-id';
import { constructListedIn, Ports as ConstructListedInPorts } from './construct-listed-in';
import { constructUserListManagement, Ports as ConstructUserListManagementPorts } from './construct-user-list-management';
import { constructRelatedArticles } from './construct-related-articles';
import { FetchRecommendedPapers } from '../../../shared-ports';

export type Params = {
  doi: Doi,
  user: O.Option<{ id: UserId }>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
  authors: ArticleAuthors,
}>;

export type Ports = GetArticleFeedEventsPorts & ConstructListedInPorts & ConstructUserListManagementPorts & {
  fetchArticle: GetArticleDetails,
  fetchRecommendedPapers: FetchRecommendedPapers,
};

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.fetchArticle(params.doi),
  TE.chainW((articleDetails) => pipe(
    {
      feedItemsByDateDescending: getArticleFeedEventsByDateDescending(ports)(
        params.doi, articleDetails.server, pipe(params.user, O.map(({ id }) => id)),
      ),
      relatedArticles: (process.env.EXPERIMENT_ENABLED === 'true') ? constructRelatedArticles(params.doi, ports) : TO.none,
    },
    sequenceS(T.ApplyPar),
    TE.rightTask,
    TE.map(({ feedItemsByDateDescending, relatedArticles }) => ({
      ...articleDetails,
      titleLanguageCode: detect(articleDetails.title, { only: ['en', 'es', 'pt'] }),
      userListManagement: constructUserListManagement(params.user, ports, params.doi),
      fullArticleUrl: `https://doi.org/${params.doi.value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
      listedIn: constructListedIn(ports)(params.doi),
      relatedArticles,
    })),
  )),
);
