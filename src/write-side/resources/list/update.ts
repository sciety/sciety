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

type ListDetails = {
  name: string,
  description: string,
};

const isAnEventOfThisList = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

const buildListDetails = (resource: E.Either<ErrorMessage, ListDetails>, event: DomainEvent) => {
  if (isEventOfType('ListCreated')(event)) {
    return E.right({ name: event.name, description: event.description } satisfies ListDetails);
  }
  if (isEventOfType('ListNameEdited')(event)) {
    return pipe(
      resource,
      E.map((listDetails) => ({ ...listDetails, name: event.name } satisfies ListDetails)),
    );
  }
  if (isEventOfType('ListDescriptionEdited')(event)) {
    return pipe(
      resource,
      E.map((listDetails) => ({ ...listDetails, description: event.description } satisfies ListDetails)),
    );
  }
  return resource;
};

const handleEditingOfName = (listDetails: ListDetails, command: EditListDetailsCommand) => (
  (listDetails.name === command.name)
    ? []
    : [constructEvent('ListNameEdited')({ listId: command.listId, name: command.name })]
);

const handleEditingOfDescription = (listDetails: ListDetails, command: EditListDetailsCommand) => (
  (listDetails.description === command.description)
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
  E.chain(RA.reduce(E.left(toErrorMessage('list-not-found')), buildListDetails)),
  E.map((listDetails) => [
    ...handleEditingOfName(listDetails, command),
    ...handleEditingOfDescription(listDetails, command),
  ]),
);
