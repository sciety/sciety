import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../../types/domain-events';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type ConstructFeedItem = (event: EditorialCommunityReviewedArticleEvent) => T.Task<FeedItem>;

const reviewedBy = (actor: Actor) => (
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

const construct = ({ actor, article, event }: Inputs) => ({
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

type GetActor = (id: GroupId) => T.Task<Actor>;

type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

export const constructFeedItem = (
  getActor: GetActor,
  getArticle: GetArticle,
): ConstructFeedItem => flow(
  (event) => ({
    actor: getActor(event.editorialCommunityId),
    article: getArticle(event.articleId),
    event: T.of(event),
  }),
  sequenceS(T.ApplyPar),
  T.map(construct),
);
