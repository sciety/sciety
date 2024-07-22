import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import {
  constructEvent,
  isEventOfType,
  DomainEvent,
  filterByName,
} from '../../../domain-events';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';
import { EditListDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const filterToRelevantEventTypes = filterByName(['ListCreated', 'ListNameEdited', 'ListDescriptionEdited']);

type RelevantEvent = ReturnType<typeof filterToRelevantEventTypes>[number];

type ListWriteModel = {
  name: string,
  description: string,
};

const isAnEventOfThisList = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

const updateListWriteModel = (resource: E.Either<ErrorMessage, ListWriteModel>, event: DomainEvent) => {
  if (isEventOfType('ListCreated')(event)) {
    return E.right({ name: event.name, description: event.description } satisfies ListWriteModel);
  }
  if (isEventOfType('ListNameEdited')(event)) {
    return pipe(
      resource,
      E.map((listResource) => ({ ...listResource, name: event.name } satisfies ListWriteModel)),
    );
  }
  if (isEventOfType('ListDescriptionEdited')(event)) {
    return pipe(
      resource,
      E.map((listResource) => ({ ...listResource, description: event.description } satisfies ListWriteModel)),
    );
  }
  return resource;
};
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
  E.right,
  E.filterOrElse(
    doesListExist(command.listId),
    () => toErrorMessage('list-not-found'),
  ),
  E.map(filterToRelevantEventTypes),
  E.map(RA.filter(isAnEventOfThisList(command.listId))),
  E.chain(RA.reduce(E.left(toErrorMessage('list-not-found')), updateListWriteModel)),
  E.map((listResource) => [
    ...handleEditingOfName(listResource, command),
    ...handleEditingOfDescription(listResource, command),
  ]),
);
