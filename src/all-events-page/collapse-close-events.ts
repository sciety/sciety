import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type CollapsedGroupEvaluatedArticle = {
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: GroupId,
  articleId: Doi,
  evaluationCount: number,
  date: Date,
};

type CollapsedGroupEvaluatedMultipleArticles = {
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  groupId: GroupId,
  articleIds: Set<string>,
  date: Date,
};

type StateEntry = DomainEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticles;

const isCollapsedGroupEvaluatedArticle = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedArticle => entry.type === 'CollapsedGroupEvaluatedArticle';

const isCollapsedGroupEvaluatedMultipleArticles = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedMultipleArticles => entry.type === 'CollapsedGroupEvaluatedMultipleArticles';

const isGroupEvaluatedArticleEvent = (event: StateEntry):
  event is GroupEvaluatedArticleEvent => (
  event.type === 'GroupEvaluatedArticle'
);

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<StateEntry>, event: GroupEvaluatedArticleEvent,
) => state.length && pipe(
  state[state.length - 1],
  (entry) => {
    if (
      isGroupEvaluatedArticleEvent(entry)
      || isCollapsedGroupEvaluatedArticle(entry)
      || isCollapsedGroupEvaluatedMultipleArticles(entry)
    ) {
      return entry.groupId === event.groupId;
    }
    return false;
  },
);

const replaceWithCollapseEvent = (
  state: Array<StateEntry>,
  event: GroupEvaluatedArticleEvent,
) => {
  const last = state.pop();
  if (!last) { return; }
  if (isGroupEvaluatedArticleEvent(last)) {
    if (event.articleId.value === last.articleId.value) {
      state.push({
        type: 'CollapsedGroupEvaluatedArticle' as const,
        articleId: last.articleId,
        groupId: last.groupId,
        evaluationCount: 2,
        date: last.date,
      });
    } else {
      state.push({
        type: 'CollapsedGroupEvaluatedMultipleArticles' as const,
        groupId: last.groupId,
        articleIds: new Set([last.articleId.value, event.articleId.value]),
        date: last.date,
      });
    }
  } else if (isCollapsedGroupEvaluatedArticle(last)) {
    if (event.articleId.value === last.articleId.value) {
      state.push({
        ...last,
        evaluationCount: last.evaluationCount + 1,
      });
    } else {
      state.push({
        type: 'CollapsedGroupEvaluatedMultipleArticles' as const,
        groupId: last.groupId,
        articleIds: new Set([last.articleId.value, event.articleId.value]),
        date: last.date,
      });
    }
  } else if (isCollapsedGroupEvaluatedMultipleArticles(last)) {
    state.push({
      ...last,
      articleIds: last.articleIds.add(event.articleId.value),
    });
  }
};

const processEvent = (
  state: Array<StateEntry>, event: DomainEvent,
) => {
  if (isGroupEvaluatedArticleEvent(event)
    && collapsesIntoPreviousEvent(state, event)) {
    replaceWithCollapseEvent(state, event);
  } else {
    state.push(event);
  }
  return state;
};

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): Array<StateEntry> => events.reduce(processEvent, []);
