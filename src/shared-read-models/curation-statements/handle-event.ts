/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { Doi } from '../../types/doi';
import { EvaluationLocator } from '../../types/evaluation-locator';
import * as GID from '../../types/group-id';

export type CurationStatement = {
  articleId: Doi,
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

export type ReadModel = Record<string, Array<CurationStatement>>;

export const initialState = (): ReadModel => ({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('CurationStatementRecorded')(event)) {
    const curationStatement = {
      articleId: event.articleId,
      evaluationLocator: event.evaluationLocator,
      groupId: event.groupId,
    };
    const currentStateForThisArticle = readmodel[event.articleId.value] ?? [];
    currentStateForThisArticle.push(curationStatement);
    readmodel[event.articleId.value] = currentStateForThisArticle;
    return readmodel;
  }
  return readmodel;
};
