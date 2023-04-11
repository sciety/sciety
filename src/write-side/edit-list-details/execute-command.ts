import { EditListDetailsCommand } from '../commands';
import { DomainEvent, listDescriptionEdited } from '../../domain-events';
import { listNameEdited } from '../../domain-events/list-name-edited-event';
import { ListResource } from '../resources/list/list-resource';

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listResource: ListResource)
=> ReadonlyArray<DomainEvent>;

const handleEditingOfName = (listResource: ListResource, command: EditListDetailsCommand) => (
  (listResource.name === command.name)
    ? []
    : [listNameEdited(command.listId, command.name)]
);

const handleEditingOfDescription = (listResource: ListResource, command: EditListDetailsCommand) => (
  (listResource.description === command.description)
    ? []
    : [listDescriptionEdited(command.listId, command.description)]
);

export const executeCommand: ExecuteCommand = (command) => (listResource) => [
  ...handleEditingOfName(listResource, command),
  ...handleEditingOfDescription(listResource, command),
];
