import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { ArticleVersionFeedItem } from './render-article-version-feed-item';
import { ReviewFeedItem } from './render-review-feed-item';
import { templateListItems } from '../shared-components';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (doi: Doi, server: ArticleServer, userId: O.Option<UserId>) => TE.TaskEither<'no-content', HtmlFragment>;

type ArticleVersionErrorFeedItem = { type: 'article-version-error', server: ArticleServer };

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | ArticleVersionErrorFeedItem;

export type GetFeedItems = (
  doi: Doi,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => T.Task<ReadonlyArray<FeedItem>>;

type RenderFeedItem = (feedItem: FeedItem) => HtmlFragment;

export const renderFeed = (
  getFeedItems: GetFeedItems,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  (doi, server, userId) => pipe(
    getFeedItems(doi, server, userId),
    T.map(RNEA.fromReadonlyArray),
    T.map(E.fromOption(constant('no-content' as const))),
    TE.map(flow(
      RNEA.map(renderFeedItem),
      (items) => `
        <section class="activity-feed">
          <ol role="list" class="activity-feed__list">
            ${templateListItems(items, 'activity-feed__item')}
          </ol>
        </section>
      `,
      toHtmlFragment,
    )),
  )
);
