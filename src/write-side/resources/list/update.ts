import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { executeCommand } from './execute-command.js';
import { EditListDetailsCommand } from '../../commands/index.js';
import { getListWriteModel } from './get-list-write-model.js';
import { ResourceAction } from '../resource-action.js';

export const update: ResourceAction<EditListDetailsCommand> = (command) => (events) => pipe(
  events,
  getListWriteModel(command.listId),
  E.map(executeCommand(command)),
);
