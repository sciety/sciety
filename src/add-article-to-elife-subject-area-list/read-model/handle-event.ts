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
 | 'subject-area-known'
 | 'evaluated-and-subject-area-known';

export type ReadModel = Record<string, ArticleState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      const transitions = {
        undefined: 'evaluated' as const,
        'subject-area-known': 'evaluated-and-subject-area-known' as const,
        'evaluated': 'evaluated' as const,
        'evaluated-and-subject-area-known': 'evaluated-and-subject-area-known' as const,
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
      undefined: 'subject-area-known' as const,
      'subject-area-known': 'subject-area-known' as const,
      'evaluated': 'evaluated-and-subject-area-known' as const,
      'evaluated-and-subject-area-known': 'evaluated-and-subject-area-known' as const,
      'listed': 'listed' as const,
    };
    readmodel[key] = transitions[readmodel[key]];
  }
  return readmodel;
};
