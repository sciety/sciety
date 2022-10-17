import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';
import { FindVersionsForArticleDoi, getArticleFeedEventsByDateDescending } from '../activity-feed/get-article-feed-events';
import { FetchReview } from '../activity-feed/get-feed-events-content';
import { renderFeed } from '../activity-feed/render-feed';
import { articleMetaTagContent } from '../article-meta-tag-content';
import { projectHasUserSavedArticle } from '../project-has-user-saved-article';
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

export type Ports = {
  fetchArticle: GetArticleDetails,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const userListUrl = (userId: O.Option<UserId>, hasUserSavedArticle: boolean) => pipe(
  userId,
  O.filter(() => hasUserSavedArticle),
  O.map((u) => `/users/${u}/lists`),
);

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  {
    doi: params.doi,
    userId: pipe(params.user, O.map((u) => u.id)),
  },
  ({ doi, userId }) => pipe(
    {
      articleDetails: ports.fetchArticle(doi),
      hasUserSavedArticle: pipe(
        userId,
        O.fold(
          constant(T.of(false)),
          (u) => pipe(
            ports.getAllEvents,
            projectHasUserSavedArticle(doi, u),
          ),
        ),
        TE.rightTask,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.chainW(({ articleDetails, hasUserSavedArticle }) => pipe(
      getArticleFeedEventsByDateDescending(ports)(doi, articleDetails.server, userId),
      TE.rightTask,
      TE.map((feedItemsByDateDescending) => ({
        doi,
        userListUrl: userListUrl(userId, hasUserSavedArticle),
        title: articleDetails.title,
        authors: articleDetails.authors,
        fullArticleUrl: `https://doi.org/${doi.value}`,
        mainContent: renderFeed(feedItemsByDateDescending),
        articleAbstract: articleDetails.abstract,
        ...articleMetaTagContent(feedItemsByDateDescending),
      })),
    )),
  ),
);
