/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

export type ArticleState = {
  listedIn: Array<ListId>,
  evaluatedBy: Array<GroupId>,
};

export type ReadModel = {
  articles: Map<string, ArticleState>,
  groups: Map<GroupId, ListId>,
};

export const initialState = (): ReadModel => ({
  articles: new Map(),
  groups: new Map(),
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ArticleAddedToList')(event)) {
    const articles = readmodel.articles;
    const a = articles.get(event.articleId.value);
    if (a !== undefined) {
      a.listedIn.push(event.listId);
    } else {
      readmodel.articles.set(event.articleId.value, {
        listedIn: [event.listId],
        evaluatedBy: [],
      });
    }
  }
  return readmodel;
};
