import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { EditListDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const update: ResourceAction<EditListDetailsCommand> = (command) => () => pipe(
  [
    constructEvent('ListNameEdited')({ listId: command.listId, name: command.name }),
    constructEvent('ListDescriptionEdited')({ listId: command.listId, description: command.description }),
  ],
  E.right,
);
