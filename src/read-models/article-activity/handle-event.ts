/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ListId } from '../../types/list-id';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { ArticleId } from '../../types/article-id';

type ArticleState = {
  articleId: ArticleId,
  lists: Set<ListId>,
};

const deleteFromSet = (set: Set<ListId>, element: ListId) => {
  set.delete(element);
  return set;
};

export type ReadModel = Map<string, ArticleState>;

export const initialState = (): ReadModel => new Map();

const handleArticleAddedToListEvent = (readmodel: ReadModel, event: EventOfType<'ArticleAddedToList'>) => {
  pipe(
    readmodel.get(event.articleId.value),
    O.fromNullable,
    O.match(
      () => readmodel.set(event.articleId.value, {
        articleId: event.articleId,
        lists: new Set([event.listId]),
      }),
      (entry) => readmodel.set(event.articleId.value, {
        ...entry,
        lists: entry.lists.add(event.listId),
      }),
    ),
  );
};

const handleArticleRemovedFromListEvent = (readmodel: ReadModel, event: EventOfType<'ArticleRemovedFromList'>) => {
  pipe(
    readmodel.get(event.articleId.value),
    O.fromNullable,
    O.match(
      () => readmodel,
      (entry) => readmodel.set(event.articleId.value, {
        ...entry,
        lists: deleteFromSet(entry.lists, event.listId),
      }),
    ),
  );
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ArticleAddedToList')(event)) {
    handleArticleAddedToListEvent(readmodel, event);
  }

  if (isEventOfType('ArticleRemovedFromList')(event)) {
    handleArticleRemovedFromListEvent(readmodel, event);
  }
  return readmodel;
};
