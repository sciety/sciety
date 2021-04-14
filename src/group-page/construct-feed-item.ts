import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import { Group } from '../types/group';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FeedEvent = EditorialCommunityReviewedArticleEvent;

type ConstructFeedItem = (group: Group) => (event: FeedEvent) => T.Task<FeedItem>;

const reviewedBy = (group: Group) => (
  (group.name === 'preLights') ? 'highlighted' : 'reviewed'
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
  group: Group,
  event: FeedEvent,
) => (article: E.Either<unknown, Article>) => ({
  avatar: group.avatarPath,
  date: event.date,
  actorName: group.name,
  actorUrl: `/groups/${group.id.value}`,
  doi: event.articleId,
  title: pipe(
    article,
    E.fold(
      constant(sanitise(toHtmlFragment('an article'))),
      (a) => a.title,
    ),
  ),
  verb: reviewedBy(group),
});

type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

export const constructFeedItem = (
  getArticle: GetArticle,
): ConstructFeedItem => (group: Group) => (event) => pipe(
  event.articleId,
  getArticle,
  T.map(construct(group, event)),
);
