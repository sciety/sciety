import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isUserSavedArticleEvent } from '../../types/domain-events';

import { UserId } from '../../types/user-id';

type UserListDetails = {
  articleCount: number,
};

export const getUserListDetails = (userId: UserId) => (events: ReadonlyArray<DomainEvent>): UserListDetails => ({
  articleCount: pipe(
    events,
    RA.filter(isUserSavedArticleEvent),
    RA.filter((event) => event.userId === userId),
    (relevantEvents) => relevantEvents.length,
  ),
});
