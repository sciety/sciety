import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../../types/domain-events';
import { UserId } from '../../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type GetSavedArticleDois = (userId: UserId) => TE.TaskEither<'no-saved-articles', RNEA.ReadonlyNonEmptyArray<Doi>>;

export const projectSavedArticleDois = (getAllEvents: GetAllEvents): GetSavedArticleDois => (userId) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isUserSavedArticleEvent),
    RA.filter((event) => event.userId === userId),
    RA.map((event) => event.articleId),
    RA.reverse,
    RNEA.fromReadonlyArray,
    E.fromOption(() => 'no-saved-articles'),
  )),
);
