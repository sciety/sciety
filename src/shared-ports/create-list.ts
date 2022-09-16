import * as TE from 'fp-ts/TaskEither';
import * as LOID from '../types/list-owner-id';

type CreateListCommand = {
  ownerId: LOID.ListOwnerId,
  name: string,
  description: string,
};

export type CreateList = (command: CreateListCommand) => TE.TaskEither<unknown, void>;
