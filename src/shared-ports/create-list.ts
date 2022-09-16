import * as TE from 'fp-ts/TaskEither';
import { CreateListCommand } from '../commands';
import * as DE from '../types/data-error';

export type CreateList = (command: CreateListCommand) => TE.TaskEither<DE.DataError, void>;
