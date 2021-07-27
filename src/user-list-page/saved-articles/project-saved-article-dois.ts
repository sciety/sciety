import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { DomainEvent, isUserSavedArticleEvent, UserSavedArticleEvent } from '../../types/domain-events';
import { UserId } from '../../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const savedArticleDois = (articleDois: ReadonlyArray<Doi>, event: UserSavedArticleEvent) => (
  [...articleDois, event.articleId]
);

type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

export const projectSavedArticleDois = (getAllEvents: GetAllEvents): GetSavedArticleDois => (userId) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isUserSavedArticleEvent),
    RA.filter((event) => event.userId === userId),
    RA.reduce([], savedArticleDois),
    RA.reverse,
  )),
);
