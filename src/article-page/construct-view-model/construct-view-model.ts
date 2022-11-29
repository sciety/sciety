import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { checkIfArticleInList, Ports as ConstructUserListUrlPorts } from './check-if-article-in-list';
import { feedSummary } from './feed-summary';
import { FindVersionsForArticleDoi, getArticleFeedEventsByDateDescending } from './get-article-feed-events';
import { FetchReview } from './get-feed-events-content';
import { DomainEvent } from '../../domain-events';
import { GetGroup } from '../../shared-ports';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { User } from '../../types/user';
import { ViewModel } from '../view-model';

export type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
  authors: ArticleAuthors,
}>;

export type Ports = ConstructUserListUrlPorts & {
  fetchArticle: GetArticleDetails,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getGroup: GetGroup,
};

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.fetchArticle(params.doi),
  TE.chainW((articleDetails) => pipe(
    getArticleFeedEventsByDateDescending(ports)(params.doi, articleDetails.server, params.user),
    TE.rightTask,
    TE.map((feedItemsByDateDescending) => ({
      ...articleDetails,
      isArticleInList: checkIfArticleInList(ports)(params.doi, params.user),
      fullArticleUrl: `https://doi.org/${params.doi.value}`,
      feedItemsByDateDescending,
      ...feedSummary(feedItemsByDateDescending),
    })),
  )),
);
