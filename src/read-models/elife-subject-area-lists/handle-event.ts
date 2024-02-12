/* eslint-disable quote-props */
/* eslint-disable no-param-reassign */
import { biorxivAndMedrxivPublisherDoiPrefix, elifeGroupId, elifeSubjectAreaLists } from './data';
import { DomainEvent, isEventOfType } from '../../domain-events';
import { SubjectArea } from '../../types/subject-area';
import * as AID from '../../types/article-id';
import * as EDOI from '../../types/expression-doi';
import { ExpressionDoi } from '../../types/expression-doi';

type ArticleStateWithSubjectArea =
 | { name: 'subject-area-known', subjectArea: SubjectArea }
 | { name: 'evaluated-and-subject-area-known', subjectArea: SubjectArea };

export type ArticleState =
 | ArticleStateWithSubjectArea
 | { name: 'evaluated' }
 | { name: 'listed' };

export type ArticleStateName = ArticleState['name'];

export type ReadModel = Record<ExpressionDoi, ArticleState>;

export const initialState = (): ReadModel => ({});

export const isStateWithSubjectArea = (state: ArticleState):
  state is ArticleStateWithSubjectArea => {
  if (state === undefined) {
    return false;
  }
  return state.name === 'subject-area-known' || state.name === 'evaluated-and-subject-area-known';
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    const expressionDoi = event.articleId;
    if (EDOI.hasPrefix(biorxivAndMedrxivPublisherDoiPrefix)(expressionDoi)) {
      if (event.groupId === elifeGroupId) {
        const transitions = {
          'initial': 'evaluated' as const,
          'evaluated': 'evaluated' as const,
          'listed': 'listed' as const,
        };
        const currentState = readmodel[expressionDoi];
        if (isStateWithSubjectArea(currentState)) {
          readmodel[expressionDoi] = { name: 'evaluated-and-subject-area-known', subjectArea: currentState.subjectArea };
        } else {
          readmodel[expressionDoi] = { name: transitions[currentState ? currentState.name : 'initial'] };
        }
      }
    }
  } else if (isEventOfType('ArticleAddedToList')(event)) {
    if (elifeSubjectAreaLists.includes(event.listId)) {
      readmodel[AID.toExpressionDoi(event.articleId)] = { name: 'listed' as const };
    }
  } else if (isEventOfType('SubjectAreaRecorded')(event)) {
    const key = AID.toExpressionDoi(event.articleId);
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
