import { sequenceS } from 'fp-ts/lib/Apply';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { Doi } from '../types/doi';
import {
  EditorialCommunityEndorsedArticleEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityEndorsedArticleEvent,
} from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

type ConstructFeedItem = (event: FeedEvent) => T.Task<FeedItem>;

const reviewedBy = (actor: Actor): string => (
  (actor.name === 'preLights') ? 'highlighted' : 'reviewed'
);

const verb = (event: FeedEvent, actor: Actor): string => (
  isEditorialCommunityEndorsedArticleEvent(event) ? 'endorsed' : reviewedBy(actor)
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

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type Article = {
  title: SanitisedHtmlFragment;
};

type Inputs = {
  actor: Actor,
  article: Result<Article, unknown>,
  event: FeedEvent,
};

const construct = ({ actor, article, event }: Inputs): FeedItem => ({
  avatar: actor.imageUrl,
  date: event.date,
  actorName: actor.name,
  actorUrl: actor.url,
  doi: event.articleId,
  title: article.mapOr(sanitise(toHtmlFragment('an article')), (a) => a.title),
  verb: verb(event, actor),
});

export type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

export type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

export const constructFeedItem = (
  getActor: GetActor,
  getArticle: GetArticle,
): ConstructFeedItem => (event) => pipe(
  {
    actor: getActor(event.editorialCommunityId),
    article: getArticle(event.articleId),
    event: T.of(event),
  },
  sequenceS(T.task),
  T.map(construct),
);
