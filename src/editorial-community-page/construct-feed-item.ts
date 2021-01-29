import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { Doi } from '../types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import { EditorialCommunity } from '../types/editorial-community';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FeedEvent = EditorialCommunityReviewedArticleEvent;

export type ConstructFeedItem = (community: EditorialCommunity) => (event: FeedEvent) => T.Task<FeedItem>;

const reviewedBy = (community: EditorialCommunity): string => (
  (community.name === 'preLights') ? 'highlighted' : 'reviewed'
);

type FeedItem = {
  avatar: string,
  date: Date,
  actorName: string,
  actorUrl: string,
  doi: Doi,
  title: SanitisedHtmlFragment,
  verb: string,
};

type Article = {
  title: SanitisedHtmlFragment,
};

const construct = (
  community: EditorialCommunity,
  event: FeedEvent,
) => (article: Result<Article, unknown>): FeedItem => ({
  avatar: community.avatar.toString(),
  date: event.date,
  actorName: community.name,
  actorUrl: `/editorial-communities/${community.id.value}`,
  doi: event.articleId,
  title: article.mapOr(sanitise(toHtmlFragment('an article')), (a) => a.title),
  verb: reviewedBy(community),
});

export type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

export const constructFeedItem = (
  getArticle: GetArticle,
): ConstructFeedItem => (community: EditorialCommunity) => (event) => pipe(
  event.articleId,
  getArticle,
  T.map(construct(community, event)),
);
