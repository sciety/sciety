/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ListId } from '../../types/list-id';
import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import { ReviewId } from '../../types/review-id';

type EvaluationState = {
  evaluationLocator: ReviewId,
  publishedAt: Date,
};

type ArticleState = {
  articleId: Doi,
  evaluationStates: Array<EvaluationState>,
  listMembershipCount: number,
  lists: Set<ListId>,
};

const deleteFromSet = (set: Set<ListId>, element: ListId) => {
  set.delete(element);
  return set;
};

export type ReadModel = Map<string, ArticleState>;

export const initialState = (): ReadModel => new Map();

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  switch (event.type) {
    case 'ArticleAddedToList':
      return pipe(
        readmodel.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => readmodel.set(event.articleId.value, {
            articleId: event.articleId,
            evaluationStates: [],
            lists: new Set([event.listId]),
            listMembershipCount: 1,
          }),
          (entry) => readmodel.set(event.articleId.value, {
            ...entry,
            lists: entry.lists.add(event.listId),
            listMembershipCount: entry.lists.add(event.listId).size,
          }),
        ),
      );

    case 'EvaluationRecorded':
      return pipe(
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
            listMembershipCount: 0,
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

    case 'IncorrectlyRecordedEvaluationErased':
      readmodel.forEach((articleState) => {
        const i = articleState.evaluationStates.findIndex(
          (evaluationState) => evaluationState.evaluationLocator === event.evaluationLocator,
        );
        if (i > -1) {
          articleState.evaluationStates.splice(i, 1);
        }
      });
      return readmodel;

    case 'ArticleRemovedFromList':
      return pipe(
        readmodel.get(event.articleId.value),
        O.fromNullable,
        O.fold(
          () => readmodel,
          (entry) => readmodel.set(event.articleId.value, {
            ...entry,
            lists: deleteFromSet(entry.lists, event.listId),
            listMembershipCount: deleteFromSet(entry.lists, event.listId).size,
          }),
        ),
      );

    default:
      return readmodel;
  }
};
