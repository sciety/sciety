/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable quote-props */
/* eslint-disable no-param-reassign */
import { pipe } from 'fp-ts/function';
import { ADT, match } from 'ts-adt';
import { elifeGroupId, elifeSubjectAreaLists } from './data';
import {
  DomainEvent,
  isArticleAddedToListEvent,
  isEvaluationRecordedEvent,
  isSubjectAreaRecordedEvent,
} from '../../domain-events';
import { SubjectArea } from '../../types/subject-area';

type SubjectAreaKnown = { _type: 'subject-area-known', subjectArea: SubjectArea };

export type EvaluatedAndSubjectAreaKnown = { _type: 'evaluated-and-subject-area-known', subjectArea: SubjectArea };

// ts-unused-exports:disable-next-line
export type ArticleState = ADT<{
  evaluated: {},
  listed: {},
  'subject-area-known': { subjectArea: SubjectArea },
  'evaluated-and-subject-area-known': { subjectArea: SubjectArea },
}>;

export type ArticleStateName = ArticleState['_type'];

type ArticleId = string;

export type ReadModel = Record<ArticleId, ArticleState>;

export type ArticleStateWithSubjectArea =
| SubjectAreaKnown
| EvaluatedAndSubjectAreaKnown;

const transition = (state: ArticleState): ArticleState => pipe(
  state,
  match({
    'subject-area-known': (s) => ({ _type: 'evaluated-and-subject-area-known' as const, subjectArea: s.subjectArea }),
    'evaluated': (s) => s,
    'evaluated-and-subject-area-known': (s) => s,
    'listed': (s) => s,
  }),
);

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      const currentState = readmodel[key];
      if (currentState === undefined) {
        readmodel[key] = { _type: 'evaluated' };
      } else {
        readmodel[key] = transition(currentState);
      }
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[event.articleId.value] = { _type: 'listed' as const };
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
    const currentStateName = readmodel[key] ? readmodel[key]._type : 'initial';
    readmodel[key] = { _type: transitions[currentStateName], subjectArea: event.subjectArea };
  }
  return readmodel;
};
