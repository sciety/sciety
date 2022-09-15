import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';

// ts-unused-exports:disable-next-line
export type Ports = {
  createList: () => TE.TaskEither<unknown, void>,
};

type CreateUserSavedArticlesListAsGenericList = (ports: Ports) => (event: DomainEvent) => T.Task<undefined>;

// ts-unused-exports:disable-next-line
export const createUserSavedArticlesListAsGenericList: CreateUserSavedArticlesListAsGenericList = (ports) => () => pipe(
  'foo',
  TE.right,
  TE.chain(ports.createList),
  TE.match(
    () => undefined,
    () => undefined,
  ),
);
