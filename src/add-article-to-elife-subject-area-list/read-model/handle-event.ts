/* eslint-disable quote-props */
/* eslint-disable no-param-reassign */
import { elifeGroupId, elifeSubjectAreaLists } from './data';
import {
  DomainEvent,
  isArticleAddedToListEvent,
  isEvaluationRecordedEvent,
  isSubjectAreaRecordedEvent,
} from '../../domain-events';

export type ArticleState =
 | 'evaluated'
 | 'listed'
 | 'category-known'
 | 'evaluated-and-category-known';

export type ReadModel = Record<string, ArticleState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      const transitions = {
        undefined: 'evaluated' as const,
        'category-known': 'evaluated-and-category-known' as const,
        'evaluated': 'evaluated' as const,
        'evaluated-and-category-known': 'evaluated-and-category-known' as const,
        'listed': 'listed' as const,
      };
      readmodel[key] = transitions[readmodel[key]];
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[event.articleId.value] = 'listed' as const;
    }
  } else if (isSubjectAreaRecordedEvent(event)) {
    const key = event.articleId.value;
    const transitions = {
      undefined: 'category-known' as const,
      'category-known': 'category-known' as const,
      'evaluated': 'evaluated-and-category-known' as const,
      'evaluated-and-category-known': 'evaluated-and-category-known' as const,
      'listed': 'listed' as const,
    };
    readmodel[key] = transitions[readmodel[key]];
  }
  return readmodel;
};
