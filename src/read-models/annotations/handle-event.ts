/* eslint-disable no-param-reassign */
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { RawUserInput } from '../../read-side';
import * as LID from '../../types/list-id';

export const rawUserInput = (input: string): RawUserInput => ({
  content: input,
});

export const accessRawValue = (input: RawUserInput): string => input.content;

type ListState = Record<string, RawUserInput>;

export type ReadModel = Record<LID.ListId, ListState>;

export const initialState = (): ReadModel => ({});

const targetListIdForAvasthiReadingUser = LID.fromValidatedString('1af5b971-162e-4cf3-abdf-57e3bbfcd0d7');
const actualListIdForAvasthiReadingUser = LID.fromValidatedString('dcc7c864-6630-40e7-8eeb-9fb6f012e92b');

const handleLegacyAnnotations = (readmodel: ReadModel, event: EventOfType<'ArticleInListAnnotated'>) => {
  if (event.listId === targetListIdForAvasthiReadingUser) {
    const actualListState = readmodel[actualListIdForAvasthiReadingUser] ?? {};
    actualListState[event.articleId.value] = rawUserInput(event.content);
    readmodel[actualListIdForAvasthiReadingUser] = actualListState;
  }
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ArticleInListAnnotated')(event)) {
    const listState = readmodel[event.listId] ?? {};
    listState[event.articleId.value] = rawUserInput(event.content);
    readmodel[event.listId] = listState;
    handleLegacyAnnotations(readmodel, event);
  }
  if (isEventOfType('ArticleRemovedFromList')(event)) {
    const listState = readmodel[event.listId] ?? {};
    delete listState[event.articleId.value];
    readmodel[event.listId] = listState;
  }
  return readmodel;
};
