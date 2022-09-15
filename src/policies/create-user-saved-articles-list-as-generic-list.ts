import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';

export type Ports = {
  createList: () => TE.TaskEither<unknown, void>,
};

type CreateUserSavedArticlesListAsGenericList = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

export const createUserSavedArticlesListAsGenericList: CreateUserSavedArticlesListAsGenericList = (
) => () => T.of(undefined);
