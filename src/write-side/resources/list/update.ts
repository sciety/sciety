import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getListWriteModel } from './get-list-write-model';
import { ListWriteModel } from './list-write-model';
import { constructEvent } from '../../../domain-events';
import { EditListDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const handleEditingOfName = (listResource: ListWriteModel, command: EditListDetailsCommand) => (
  (listResource.name === command.name)
    ? []
    : [constructEvent('ListNameEdited')({ listId: command.listId, name: command.name })]
);

const handleEditingOfDescription = (listResource: ListWriteModel, command: EditListDetailsCommand) => (
  (listResource.description === command.description)
    ? []
    : [constructEvent('ListDescriptionEdited')({ listId: command.listId, description: command.description })]
);

export const update: ResourceAction<EditListDetailsCommand> = (command) => (events) => pipe(
  events,
  getListWriteModel(command.listId),
  E.map((listResource) => [
    ...handleEditingOfName(listResource, command),
    ...handleEditingOfDescription(listResource, command),
  ]),
);
