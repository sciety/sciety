import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import {
  ArticleRemovedFromListEvent,
  DomainEvent,
  isArticleRemovedFromListEvent,
  isUserSavedArticleEvent,
  UserSavedArticleEvent,
} from '../../types/domain-events';
import { UserId } from '../../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type RelevantEvent = UserSavedArticleEvent | ArticleRemovedFromListEvent;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isUserSavedArticleEvent(event) || isArticleRemovedFromListEvent(event)
);

const savedArticleDois = (
  articleDois: ReadonlyArray<Doi>,
  event: RelevantEvent,
) => (
  isUserSavedArticleEvent(event)
    ? [...articleDois, event.articleId]
    : pipe(
      articleDois,
      RA.filter((doi) => doi.value !== event.articleId.value),
    )
);

type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

export const projectSavedArticleDois = (getAllEvents: GetAllEvents): GetSavedArticleDois => (userId) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isRelevantEvent),
    RA.filter((event) => event.userId === userId),
    RA.reduce([], savedArticleDois),
    RA.reverse,
  )),
);
