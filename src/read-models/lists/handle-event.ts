/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { toExpressionDoi } from '../../types/article-id';
import { ListId } from '../../types/list-id';
import { List, ListEntry } from './list';

type ListState = Pick<
List,
'id' | 'ownerId' | 'updatedAt' | 'name' | 'description'
> & {
  entries: Array<ListEntry>,
  version: number,
};

const incrementListVersion = (readModel: ReadModel, listId: ListId) => { readModel[listId].version += 1; };

export type ReadModel = Record<ListId, ListState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ListCreated')(event)) {
    readmodel[event.listId] = {
      id: event.listId,
      ownerId: event.ownerId,
      entries: [],
      updatedAt: event.date,
      name: event.name,
      description: event.description,
      version: 0,
    };
  } else if (isEventOfType('ArticleAddedToList')(event)) {
    const expressionDoi = toExpressionDoi(event.articleId);
    incrementListVersion(readmodel, event.listId);
    readmodel[event.listId].entries.push({
      expressionDoi,
      addedAtListVersion: readmodel[event.listId].version,
    });
    readmodel[event.listId].updatedAt = event.date;
  } else if (isEventOfType('ArticleRemovedFromList')(event)) {
    incrementListVersion(readmodel, event.listId);
    readmodel[event.listId].entries = readmodel[event.listId].entries.filter(
      (entry) => entry.expressionDoi !== toExpressionDoi(event.articleId),
    );
    readmodel[event.listId].updatedAt = event.date;
  } else if (isEventOfType('ListNameEdited')(event)) {
    incrementListVersion(readmodel, event.listId);
    readmodel[event.listId].name = event.name;
    readmodel[event.listId].updatedAt = event.date;
  } else if (isEventOfType('ListDescriptionEdited')(event)) {
    incrementListVersion(readmodel, event.listId);
    readmodel[event.listId].description = event.description;
    readmodel[event.listId].updatedAt = event.date;
  }
  return readmodel;
};
