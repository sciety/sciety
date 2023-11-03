import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { executeCommand } from './execute-command';
import { EditListDetailsCommand } from '../../commands';
import { getListWriteModel } from './get-list-write-model';
import { ResourceAction } from '../resource-action';

export const update: ResourceAction<EditListDetailsCommand> = (command) => (events) => pipe(
  events,
  getListWriteModel(command.listId),
  E.map(executeCommand(command)),
);
