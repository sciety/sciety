import { EditListDetailsCommand } from '../../commands';
import { DomainEvent, constructEvent } from '../../../domain-events';
import { ListResource } from './list-resource';

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listResource: ListResource)
=> ReadonlyArray<DomainEvent>;

const handleEditingOfName = (listResource: ListResource, command: EditListDetailsCommand) => (
  (listResource.name === command.name)
    ? []
    : [constructEvent('ListNameEdited')({ listId: command.listId, name: command.name })]
);

const handleEditingOfDescription = (listResource: ListResource, command: EditListDetailsCommand) => (
  (listResource.description === command.description)
    ? []
    : [constructEvent('ListDescriptionEdited')({ listId: command.listId, description: command.description })]
);

export const executeCommand: ExecuteCommand = (command) => (listResource) => [
  ...handleEditingOfName(listResource, command),
  ...handleEditingOfDescription(listResource, command),
];
