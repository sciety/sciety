import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type Command = {
  articleId: Doi,
  listId: ListId,
};

type ExecuteCommand = (command: Command)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<unknown, ReadonlyArray<RuntimeGeneratedEvent>>;

export const executeCommand: ExecuteCommand = () => () => pipe(
  E.right([]),
);
