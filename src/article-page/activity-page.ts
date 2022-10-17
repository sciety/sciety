import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { FindVersionsForArticleDoi, getArticleFeedEventsByDateDescending } from './activity-feed/get-article-feed-events';
import { FetchReview } from './activity-feed/get-feed-events-content';
import { renderFeed } from './activity-feed/render-feed';
import { articleMetaTagContent } from './article-meta-tag-content';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { renderFullArticleLink } from './render-article-actions';
import { renderDescriptionMetaTagContent } from './render-description-meta-tag-content';
import { renderPage } from './render-page';
import { renderSaveArticle } from './render-save-article';
import { DomainEvent } from '../domain-events';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';

type ActivityPage = (ports: Ports) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Params = {
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

type Ports = {
  fetchArticle: GetArticleDetails,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const toErrorPage = (error: DE.DataError) => ({
  type: error,
  message: toHtmlFragment(`
    The title and authors for this article are not available from our external data provider. 
    We will be able to show you this page once the data becomes available.
    We are sorry for the inconvenience. <a href="https://go.sciety.org/rprterrorpg">Report this error to us.</a>
  `),
});

export const articleActivityPage: ActivityPage = (ports) => (params) => pipe(
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
        articleDetails,
        feedItemsByDateDescending,
        title: articleDetails.title,
        authors: articleDetails.authors,
        articleActions: {
          fullArticleLink: renderFullArticleLink(doi),
          saveArticle: renderSaveArticle(doi, userId, hasUserSavedArticle),
        },
        mainContent: renderFeed(feedItemsByDateDescending),
        articleAbstract: articleDetails.abstract,
      })),
    )),
  ),
  TE.bimap(
    toErrorPage,
    (viewmodel) => ({
      content: renderPage(viewmodel),
      title: striptags(viewmodel.articleDetails.title),
      description: pipe(
        articleMetaTagContent(viewmodel.feedItemsByDateDescending),
        renderDescriptionMetaTagContent,
      ),
      openGraph: {
        title: striptags(viewmodel.articleDetails.title),
        description: striptags(viewmodel.articleDetails.abstract),
      },
    }),
  ),
);
