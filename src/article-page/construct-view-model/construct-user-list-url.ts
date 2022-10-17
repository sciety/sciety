import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { GetAllEvents } from '../../shared-ports';
import { Doi } from '../../types/doi';
import { UserId } from '../../types/user-id';

export type Ports = {
  getAllEvents: GetAllEvents,
};

export const constructUserListUrl = (ports: Ports) => (
  doi: Doi,
  userId: O.Option<UserId>,
): TE.TaskEither<never, O.Option<string>> => pipe(
  userId,
  O.fold(
    constant(T.of(O.none)),
    (u) => pipe(
      ports.getAllEvents,
      T.map(projectHasUserSavedArticle(doi, u)),
      T.map(O.guard),
      T.map(O.map(() => `/users/${u}/lists`)),
    ),
  ),
  TE.rightTask,
);
