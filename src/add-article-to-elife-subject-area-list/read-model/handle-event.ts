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

type Evaluated = {
  name: 'evaluated',
};

type Listed = {
  name: 'listed',
};

type SubjectAreaKnown = { name: 'subject-area-known', subjectArea: SubjectArea };

type EvaluatedAndSubjectAreaKnown = { name: 'evaluated-and-subject-area-known', subjectArea: SubjectArea };

// ts-unused-exports:disable-next-line
export type ArticleState =
 | Evaluated
 | Listed
 | SubjectAreaKnown
 | EvaluatedAndSubjectAreaKnown;

export type ArticleStateName = ArticleState['name'];

type ArticleId = string;

export type ReadModel = Record<ArticleId, ArticleState>;

export type ArticleStateWithSubjectArea =
| SubjectAreaKnown
| EvaluatedAndSubjectAreaKnown;

const isStateWithSubjectArea = (state: ArticleState):
  state is ArticleStateWithSubjectArea => {
  if (state === undefined) {
    return false;
  }
  return state.name === 'subject-area-known' || state.name === 'evaluated-and-subject-area-known';
};

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      const transitions = {
        'initial': 'evaluated' as const,
        'evaluated': 'evaluated' as const,
        'listed': 'listed' as const,
      };
      const currentState = readmodel[key];
      if (isStateWithSubjectArea(currentState)) {
        readmodel[key] = { name: 'evaluated-and-subject-area-known', subjectArea: currentState.subjectArea };
      } else {
        readmodel[key] = { name: transitions[currentState ? currentState.name : 'initial'] };
      }
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
