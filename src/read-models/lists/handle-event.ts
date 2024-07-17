/* eslint-disable no-param-reassign */
/* eslint-disable no-loops/no-loops */
/* eslint-disable no-restricted-syntax */
import { List, ListEntry } from './list';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { rawUserInput } from '../../read-side';
import { toExpressionDoi } from '../../types/article-id';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

type ListState = Pick<
List,
'id' | 'ownerId' | 'updatedAt' | 'name' | 'description'
> & {
  entries: Map<ExpressionDoi, ListEntry>,
  version: number,
};

export const toList = (
  listState: ListState,
): List => ({ ...listState, entries: Array.from(listState.entries.values()) });

const registerUpdateToList = (readModel: ReadModel, listId: ListId, date: Date) => {
  if (readModel.byListId[listId] !== undefined) {
    readModel.byListId[listId].version += 1;
    readModel.byListId[listId].updatedAt = date;
  }
};

export type ReadModel = {
  byListId: Record<ListId, ListState>,
  byPromotingGroupId: Record<GroupId, Map<ListId, List>>,
  usedListIds: Array<ListId>,
};

export const initialState = (): ReadModel => ({
  byListId: {},
  byPromotingGroupId: {},
  usedListIds: [],
});

const handleArticleRemovedFromListEvent = (readModel: ReadModel, event: EventOfType<'ArticleRemovedFromList'>) => {
  const listState = readModel.byListId[event.listId];
  if (listState !== undefined) {
    if (listState.entries.delete(toExpressionDoi(event.articleId))) {
      registerUpdateToList(readModel, event.listId, event.date);
    }
  }
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ListCreated')(event)) {
    if (!readmodel.usedListIds.includes(event.listId)) {
      readmodel.byListId[event.listId] = {
        id: event.listId,
        ownerId: event.ownerId,
        entries: new Map(),
        updatedAt: event.date,
        name: event.name,
        description: rawUserInput(event.description),
        version: 0,
      };
      readmodel.usedListIds.push(event.listId);
    }
  } else if (isEventOfType('ListDeleted')(event)) {
    delete readmodel.byListId[event.listId];

    for (const groupId in readmodel.byPromotingGroupId) {
      if (Object.hasOwn(readmodel.byPromotingGroupId, groupId)) {
        const groupPromotions = readmodel.byPromotingGroupId[groupId as GroupId];
        if (groupPromotions.get(event.listId) !== undefined) {
          groupPromotions.delete(event.listId);
        }
      }
    }
  } else if (isEventOfType('ArticleAddedToList')(event)) {
    const listState = readmodel.byListId[event.listId];
    const expressionDoi = toExpressionDoi(event.articleId);
    registerUpdateToList(readmodel, event.listId, event.date);
    listState.entries.set(expressionDoi, {
      expressionDoi,
      addedAtListVersion: listState.version,
    });
  } else if (isEventOfType('ArticleRemovedFromList')(event)) {
    handleArticleRemovedFromListEvent(readmodel, event);
  } else if (isEventOfType('ListNameEdited')(event)) {
    const listState = readmodel.byListId[event.listId];
    registerUpdateToList(readmodel, event.listId, event.date);
    listState.name = event.name;
  } else if (isEventOfType('ListDescriptionEdited')(event)) {
    const listState = readmodel.byListId[event.listId];
    registerUpdateToList(readmodel, event.listId, event.date);
    listState.description = rawUserInput(event.description);
  } else if (isEventOfType('ListPromotionCreated')(event)) {
    const listState = readmodel.byListId[event.listId];
    if (listState !== undefined) {
      if (readmodel.byPromotingGroupId[event.byGroup] === undefined) {
        readmodel.byPromotingGroupId[event.byGroup] = new Map();
      }
      readmodel.byPromotingGroupId[event.byGroup].set(listState.id, toList(listState));
    }
  } else if (isEventOfType('ListPromotionRemoved')(event)) {
    const listState = readmodel.byListId[event.listId];
    if (listState !== undefined) {
      if (readmodel.byPromotingGroupId[event.byGroup] !== undefined) {
        readmodel.byPromotingGroupId[event.byGroup].delete(listState.id);
      }
    }
  }
  return readmodel;
};
