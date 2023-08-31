/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { HtmlFragment } from '../../types/html-fragment';
import * as LID from '../../types/list-id';

type ListState = Record<string, HtmlFragment>;

export type ReadModel = Record<LID.ListId, ListState>;

export const initialState = (): ReadModel => ({});

const targetListIdForAvasthiReadingUser = LID.fromValidatedString('1af5b971-162e-4cf3-abdf-57e3bbfcd0d7');
const actualListIdForAvasthiReadingUser = LID.fromValidatedString('dcc7c864-6630-40e7-8eeb-9fb6f012e92b');

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('AnnotationCreated')(event)) {
    const listState = readmodel[event.target.listId] ?? {};
    listState[event.target.articleId.value] = event.content;
    readmodel[event.target.listId] = listState;
    if (event.target.listId === targetListIdForAvasthiReadingUser) {
      const actualListState = readmodel[actualListIdForAvasthiReadingUser] ?? {};
      actualListState[event.target.articleId.value] = event.content;
      readmodel[actualListIdForAvasthiReadingUser] = actualListState;
    }
  }
  return readmodel;
};
