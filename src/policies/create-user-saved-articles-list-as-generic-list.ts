import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';

// ts-unused-exports:disable-next-line
export type Ports = {
  createList: () => TE.TaskEither<unknown, void>,
};

type CreateUserSavedArticlesListAsGenericList = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

// ts-unused-exports:disable-next-line
export const createUserSavedArticlesListAsGenericList: CreateUserSavedArticlesListAsGenericList = (
) => () => T.of(undefined);
