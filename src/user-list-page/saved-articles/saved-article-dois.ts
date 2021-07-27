import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import {
  ArticleRemovedFromUserListEvent,
  DomainEvent,
  isArticleRemovedFromUserListEvent,
  isUserSavedArticleEvent,
  UserSavedArticleEvent,
} from '../../types/domain-events';
import { UserId } from '../../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type RelevantEvent = UserSavedArticleEvent | ArticleRemovedFromUserListEvent;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isUserSavedArticleEvent(event) || isArticleRemovedFromUserListEvent(event)
);

const updateProjection = (
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

type SavedArticleDois = (userId: UserId) => ReadonlyArray<Doi>;

export const savedArticleDois = (events: ReadonlyArray<DomainEvent>): SavedArticleDois => (userId) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.userId === userId),
  RA.reduce([], updateProjection),
  RA.reverse,
);
