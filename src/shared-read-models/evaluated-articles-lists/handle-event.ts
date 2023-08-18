/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';
import { evaluatedArticlesListIdsByGroupId } from '../ids-of-evaluated-articles-lists/handle-event';

export type ArticleState = {
  listedIn: Array<ListId>,
  evaluatedBy: Array<GroupId>,
};

export type ReadModel = {
  articles: Map<string, ArticleState>,
  groups: Map<string, ListId>,
};

export const initialState = (): ReadModel => ({
  articles: new Map(),
  groups: new Map(Object.entries(evaluatedArticlesListIdsByGroupId)),
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ArticleAddedToList')(event)) {
    const a = readmodel.articles.get(event.articleId.value);
    if (a !== undefined) {
      a.listedIn.push(event.listId);
    } else {
      readmodel.articles.set(event.articleId.value, {
        listedIn: [event.listId],
        evaluatedBy: [],
      });
    }
  }
  if (isEventOfType('EvaluatedArticlesListSpecified')(event)) {
    readmodel.groups.set(event.groupId, event.listId);
  }
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    const a = readmodel.articles.get(event.articleId.value);
    if (a !== undefined) {
      a.evaluatedBy.push(event.groupId);
    } else {
      readmodel.articles.set(event.articleId.value, {
        listedIn: [],
        evaluatedBy: [event.groupId],
      });
    }
  }
  return readmodel;
};
