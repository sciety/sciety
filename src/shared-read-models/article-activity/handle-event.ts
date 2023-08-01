/* eslint-disable no-param-reassign */
import * as B from 'fp-ts/boolean';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListId } from '../../types/list-id';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
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

const addToEvaluationStates = (state: ArticleState['evaluationStates'], event: EventOfType<'EvaluationRecorded'>) => pipe(
  state,
  RA.some((evaluationState) => evaluationState.evaluationLocator === event.evaluationLocator),
  B.fold(
    () => [
      ...state,
      {
        evaluationLocator: event.evaluationLocator,
        publishedAt: event.publishedAt,
      },
    ],
    () => state,
  ),
);

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
};

const handleEvaluationRecordedEvent = (readmodel: ReadModel, event: EventOfType<'EvaluationRecorded'>) => {
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
        evaluationStates: addToEvaluationStates(entry.evaluationStates, event),
      }),
    ),
  );
};

const handleIncorrectlyRecordedEvaluationErasedEvent = (readmodel: ReadModel, event: EventOfType<'IncorrectlyRecordedEvaluationErased'>) => {
  readmodel.forEach((articleState) => {
    const i = articleState.evaluationStates.findIndex(
      (evaluationState) => evaluationState.evaluationLocator === event.evaluationLocator,
    );
    if (i > -1) {
      articleState.evaluationStates.splice(i, 1);
    }
  });
};

const handleEvaluationRemovalRecordedEvent = (readmodel: ReadModel, event: EventOfType<'EvaluationRemovalRecorded'>) => {
  readmodel.forEach((articleState) => {
    const i = articleState.evaluationStates.findIndex(
      (evaluationState) => evaluationState.evaluationLocator === event.evaluationLocator,
    );
    if (i > -1) {
      articleState.evaluationStates.splice(i, 1);
    }
  });
};

const handleArticleRemovedFromListEvent = (readmodel: ReadModel, event: EventOfType<'ArticleRemovedFromList'>) => {
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
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ArticleAddedToList')(event)) {
    handleArticleAddedToListEvent(readmodel, event);
  }

  if (isEventOfType('EvaluationRecorded')(event)) {
    handleEvaluationRecordedEvent(readmodel, event);
  }

  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    handleIncorrectlyRecordedEvaluationErasedEvent(readmodel, event);
  }

  if (isEventOfType('EvaluationRemovalRecorded')(event)) {
    handleEvaluationRemovalRecordedEvent(readmodel, event);
  }

  if (isEventOfType('ArticleRemovedFromList')(event)) {
    handleArticleRemovedFromListEvent(readmodel, event);
  }
  return readmodel;
};
