import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { getListWriteModel } from './get-list-write-model';
import { EditListDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const update: ResourceAction<EditListDetailsCommand> = (command) => (events) => pipe(
  events,
  getListWriteModel(command.listId),
  E.map(executeCommand(command)),
);
