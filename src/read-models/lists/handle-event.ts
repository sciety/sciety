/* eslint-disable no-param-reassign */
import { List, ListEntry } from './list';
import { DomainEvent, isEventOfType } from '../../domain-events';
import { rawUserInput } from '../../read-side';
import { toExpressionDoi } from '../../types/article-id';
import { ListId } from '../../types/list-id';

type ListState = Pick<
List,
'id' | 'ownerId' | 'updatedAt' | 'name' | 'description'
> & {
  entries: Array<ListEntry>,
  version: number,
};

const registerUpdateToList = (readModel: ReadModel, listId: ListId, date: Date) => {
  readModel[listId].version += 1;
  readModel[listId].updatedAt = date;
};

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
      description: rawUserInput(event.description),
      version: 0,
    };
  } else if (isEventOfType('ArticleAddedToList')(event)) {
    const expressionDoi = toExpressionDoi(event.articleId);
    registerUpdateToList(readmodel, event.listId, event.date);
    readmodel[event.listId].entries.push({
      expressionDoi,
      addedAtListVersion: readmodel[event.listId].version,
    });
  } else if (isEventOfType('ArticleRemovedFromList')(event)) {
    registerUpdateToList(readmodel, event.listId, event.date);
    readmodel[event.listId].entries = readmodel[event.listId].entries.filter(
      (entry) => entry.expressionDoi !== toExpressionDoi(event.articleId),
    );
  } else if (isEventOfType('ListNameEdited')(event)) {
    registerUpdateToList(readmodel, event.listId, event.date);
    readmodel[event.listId].name = event.name;
  } else if (isEventOfType('ListDescriptionEdited')(event)) {
    registerUpdateToList(readmodel, event.listId, event.date);
    readmodel[event.listId].description = rawUserInput(event.description);
  }
  return readmodel;
};
