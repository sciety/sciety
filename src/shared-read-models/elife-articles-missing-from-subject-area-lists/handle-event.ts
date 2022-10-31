/* eslint-disable no-param-reassign */
import { elifeGroupId, elifeSubjectAreaLists } from './data';
import { DomainEvent, isArticleAddedToListEvent, isEvaluationRecordedEvent } from '../../domain-events';

export type ArticleState = 'evaluated' | 'listed';
export type ReadModel = Record<string, ArticleState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      if (readmodel[key] === undefined) {
        readmodel[key] = 'evaluated' as ArticleState;
      }
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[event.articleId.value] = 'listed' as ArticleState;
    }
  }
  return readmodel;
};
