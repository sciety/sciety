/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable quote-props */
/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
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

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === elifeGroupId) {
      const key = event.articleId.value;
      readmodel[key] = pipe(
        readmodel,
        R.lookup(key),
        O.fold(
          () => ({ _type: 'evaluated' }),
          match({
            'subject-area-known': (s) => ({ _type: 'evaluated-and-subject-area-known' as const, subjectArea: s.subjectArea }),
            'evaluated': (s) => s,
            'evaluated-and-subject-area-known': (s) => s,
            'listed': (s) => s,
          }),
        ),
      );
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[event.articleId.value] = { _type: 'listed' as const };
    }
  } else if (isSubjectAreaRecordedEvent(event)) {
    const key = event.articleId.value;
    readmodel[key] = pipe(
      readmodel,
      R.lookup(key),
      O.fold(
        () => ({ _type: 'subject-area-known', subjectArea: event.subjectArea }),
        match({
          'subject-area-known': (s) => (s),
          'evaluated': () => ({ _type: 'evaluated-and-subject-area-known' as const, subjectArea: event.subjectArea }),
          'evaluated-and-subject-area-known': (s) => s,
          'listed': (s) => s,
        }),
      ),
    );
  }
  return readmodel;
};
