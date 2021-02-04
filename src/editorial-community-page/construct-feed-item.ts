import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
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
) => (article: E.Either<unknown, Article>): FeedItem => ({
  avatar: community.avatarPath,
  date: event.date,
  actorName: community.name,
  actorUrl: `/editorial-communities/${community.id.value}`,
  doi: event.articleId,
  title: pipe(
    article,
    E.fold(
      constant(sanitise(toHtmlFragment('an article'))),
      (a) => a.title,
    ),
  ),
  verb: reviewedBy(community),
});

export type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

export const constructFeedItem = (
  getArticle: GetArticle,
): ConstructFeedItem => (community: EditorialCommunity) => (event) => pipe(
  event.articleId,
  getArticle,
  T.map(construct(community, event)),
);
