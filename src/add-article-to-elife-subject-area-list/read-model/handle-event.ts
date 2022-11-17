/* eslint-disable quote-props */
/* eslint-disable no-param-reassign */
import { elifeGroupId, elifeSubjectAreaLists } from './data';
import {
  DomainEvent,
  isArticleAddedToListEvent,
  isEvaluationRecordedEvent,
  isSubjectAreaRecordedEvent,
} from '../../domain-events';
import { SubjectArea } from '../../types/subject-area';

export type ArticleStateName =
| 'evaluated'
| 'listed'
| 'subject-area-known'
| 'evaluated-and-subject-area-known';

type ArticleState =
 | { name: 'evaluated' }
 | { name: 'listed' }
 | { name: 'subject-area-known', subjectArea: SubjectArea }
 | { name: 'evaluated-and-subject-area-known' };

export type ReadModel = Record<string, ArticleState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      const transitions = {
        'initial': 'evaluated' as const,
        'subject-area-known': 'evaluated-and-subject-area-known' as const,
        'evaluated': 'evaluated' as const,
        'evaluated-and-subject-area-known': 'evaluated-and-subject-area-known' as const,
        'listed': 'listed' as const,
      };
      const currentStateName = readmodel[key] ? readmodel[key].name : 'initial';
      readmodel[key] = { name: transitions[currentStateName] };
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[event.articleId.value] = { name: 'listed' as const };
    }
  } else if (isSubjectAreaRecordedEvent(event)) {
    const key = event.articleId.value;
    const transitions = {
      'initial': 'subject-area-known' as const,
      'subject-area-known': 'subject-area-known' as const,
      'evaluated': 'evaluated-and-subject-area-known' as const,
      'evaluated-and-subject-area-known': 'evaluated-and-subject-area-known' as const,
      'listed': 'listed' as const,
    };
    const currentStateName = readmodel[key] ? readmodel[key].name : 'initial';
    readmodel[key] = { name: transitions[currentStateName], subjectArea: event.subjectArea };
  }
  return readmodel;
};
