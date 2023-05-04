import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { executeCommand } from './execute-command';
import { EditListDetailsCommand } from '../../commands';
import { replayListResource } from './replay-list-resource';
import { ResourceAction } from '../resource-action';

export const update: ResourceAction<EditListDetailsCommand> = (command) => (events) => pipe(
  events,
  replayListResource(command.listId),
  E.map(executeCommand(command)),
);
