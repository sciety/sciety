/* eslint-disable no-param-reassign */
import { elifeGroupId, elifeSubjectAreaLists } from './data';
import {
  DomainEvent, isArticleAddedToListEvent, isBiorxivCategoryRecordedEvent, isEvaluationRecordedEvent,
} from '../../domain-events';

export type ArticleState = 'evaluated' | 'listed' | 'category-known';
export type ReadModel = Record<string, ArticleState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      if (readmodel[key] === undefined) {
        readmodel[key] = 'evaluated' as const;
      }
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[event.articleId.value] = 'listed' as const;
    }
  } else if (isBiorxivCategoryRecordedEvent(event)) {
    readmodel[event.articleId.value] = 'category-known' as const;
  }
  return readmodel;
};
