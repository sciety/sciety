/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable quote-props */
/* eslint-disable no-param-reassign */
import { MakeADT } from 'ts-adt/MakeADT';
import { elifeGroupId, elifeSubjectAreaLists } from './data';
import {
  DomainEvent,
  isArticleAddedToListEvent,
  isEvaluationRecordedEvent,
  isSubjectAreaRecordedEvent,
} from '../../domain-events';
import { SubjectArea } from '../../types/subject-area';

type SubjectAreaKnown = { name: 'subject-area-known', subjectArea: SubjectArea };

type EvaluatedAndSubjectAreaKnown = { name: 'evaluated-and-subject-area-known', subjectArea: SubjectArea };

// ts-unused-exports:disable-next-line
export type ArticleState = MakeADT<'name', {
  evaluated: {},
  listed: {},
  'subject-area-known': { subjectArea: SubjectArea },
  'evaluated-and-subject-area-known': { subjectArea: SubjectArea },
}>;

export type ArticleStateName = ArticleState['name'];

type ArticleId = string;

export type ReadModel = Record<ArticleId, ArticleState>;

export type ArticleStateWithSubjectArea =
| SubjectAreaKnown
| EvaluatedAndSubjectAreaKnown;

const transition = (state: ArticleState): ArticleState => {
  switch (state.name) {
    case 'subject-area-known':
      return { name: 'evaluated-and-subject-area-known', subjectArea: state.subjectArea };
    case 'listed':
    case 'evaluated-and-subject-area-known':
    case 'evaluated':
      return state;
  }
};

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      const currentState = readmodel[key];
      if (currentState === undefined) {
        readmodel[key] = { name: 'evaluated' };
      } else {
        readmodel[key] = transition(currentState);
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
