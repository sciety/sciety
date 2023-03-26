/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { DomainEvent } from '../../domain-events';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { isAnnotationCreatedEvent } from '../../domain-events/annotation-created-event';

type ListState = Record<string, HtmlFragment>;

export type ReadModel = Record<ListId, ListState>;

// ts-unused-exports:disable-next-line
export const initialState = (): ReadModel => ({});

// ts-unused-exports:disable-next-line
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isAnnotationCreatedEvent(event)) {
    const listState = readmodel[event.target.listId] ?? {};
    listState[event.target.articleId.value] = event.content;
    readmodel[event.target.listId] = listState;
  }
  return readmodel;
};
