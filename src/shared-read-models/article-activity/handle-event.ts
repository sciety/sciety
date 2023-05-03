/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ListId } from '../../types/list-id';
import {
  DomainEvent,
  isArticleAddedToListEvent, isArticleRemovedFromListEvent,
  isEvaluationRecordedEvent,
  isIncorrectlyRecordedEvaluationErasedEvent,
} from '../../domain-events';
import { Doi } from '../../types/doi';
import { EvaluationLocator } from '../../types/evaluation-locator';

type EvaluationState = {
  evaluationLocator: EvaluationLocator,
  publishedAt: Date,
};

type ArticleState = {
  articleId: Doi,
  evaluationStates: Array<EvaluationState>,
  lists: Set<ListId>,
};

const deleteFromSet = (set: Set<ListId>, element: ListId) => {
  set.delete(element);
  return set;
};

export type ReadModel = Map<string, ArticleState>;

export const initialState = (): ReadModel => new Map();

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isArticleAddedToListEvent(event)) {
    pipe(
      readmodel.get(event.articleId.value),
      O.fromNullable,
      O.fold(
        () => readmodel.set(event.articleId.value, {
          articleId: event.articleId,
          evaluationStates: [],
          lists: new Set([event.listId]),
        }),
        (entry) => readmodel.set(event.articleId.value, {
          ...entry,
          lists: entry.lists.add(event.listId),
        }),
      ),
    );
  }

  if (isEvaluationRecordedEvent(event)) {
    pipe(
      readmodel.get(event.articleId.value),
      O.fromNullable,
      O.fold(
        () => readmodel.set(event.articleId.value, {
          articleId: event.articleId,
          evaluationStates: [{
            evaluationLocator: event.evaluationLocator,
            publishedAt: event.publishedAt,
          }],
          lists: new Set(),
        }),
        (entry) => readmodel.set(event.articleId.value, {
          ...entry,
          evaluationStates: [...entry.evaluationStates, {
            evaluationLocator: event.evaluationLocator,
            publishedAt: event.publishedAt,
          }],
        }),
      ),
    );
  }

  if (isIncorrectlyRecordedEvaluationErasedEvent(event)) {
    readmodel.forEach((articleState) => {
      const i = articleState.evaluationStates.findIndex(
        (evaluationState) => evaluationState.evaluationLocator === event.evaluationLocator,
      );
      if (i > -1) {
        articleState.evaluationStates.splice(i, 1);
      }
    });
  }

  if (isArticleRemovedFromListEvent(event)) {
    pipe(
      readmodel.get(event.articleId.value),
      O.fromNullable,
      O.fold(
        () => readmodel,
        (entry) => readmodel.set(event.articleId.value, {
          ...entry,
          lists: deleteFromSet(entry.lists, event.listId),
        }),
      ),
    );
  }
  return readmodel;
};
