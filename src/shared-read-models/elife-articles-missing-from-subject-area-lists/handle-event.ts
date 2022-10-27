/* eslint-disable no-param-reassign */
import { elifeSubjectAreaLists } from './data';
import { DomainEvent, isArticleAddedToListEvent, isEvaluationRecordedEvent } from '../../domain-events';
import * as GroupId from '../../types/group-id';

export type ArticleState = 'missing' | 'added';
export type MissingArticles = Record<string, ArticleState>;

export const initialState = (): MissingArticles => ({});

export const handleEvent = (readmodel: MissingArticles, event: DomainEvent): MissingArticles => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')) {
      const key = event.articleId.value;
      if (readmodel[key] === undefined) {
        readmodel[key] = 'missing' as ArticleState;
      }
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[event.articleId.value] = 'added' as ArticleState;
    }
  }
  return readmodel;
};
