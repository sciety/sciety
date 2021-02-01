import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type ConstructFeedItem = (event: EditorialCommunityReviewedArticleEvent) => T.Task<FeedItem>;

const reviewedBy = (actor: Actor): string => (
  (actor.name === 'preLights') ? 'highlighted' : 'reviewed'
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
  url: string,
  name: string,
  imageUrl: string,
};

type Article = {
  title: SanitisedHtmlFragment,
};

type Inputs = {
  actor: Actor,
  article: E.Either<unknown, Article>,
  event: EditorialCommunityReviewedArticleEvent,
};

const construct = ({ actor, article, event }: Inputs): FeedItem => ({
  avatar: actor.imageUrl,
  date: event.date,
  actorName: actor.name,
  actorUrl: actor.url,
  doi: event.articleId,
  title: pipe(
    article,
    E.fold(
      constant(sanitise(toHtmlFragment('an article'))),
      (a) => a.title,
    ),
  ),
  verb: reviewedBy(actor),
});

export type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

export type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

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
