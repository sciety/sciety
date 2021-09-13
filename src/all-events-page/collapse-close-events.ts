import { pipe } from 'fp-ts/function';
import { DomainEvent, EditorialCommunityReviewedArticleEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type CollapsedGroupEvaluatedArticle = {
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: GroupId,
  articleId: Doi,
};

type StateEntry = DomainEvent | CollapsedGroupEvaluatedArticle;

const isCollapsedGroupEvaluatedArticle = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedArticle => entry.type === 'CollapsedGroupEvaluatedArticle';

const isEditorialCommunityReviewedArticleEvent = (event: StateEntry):
  event is EditorialCommunityReviewedArticleEvent => (
  event.type === 'EditorialCommunityReviewedArticle'
);

const isPreviousEntryRelevant = (state: ReadonlyArray<StateEntry>) => state.length && pipe(
  state[state.length - 1],
  (entry) => isEditorialCommunityReviewedArticleEvent(entry) || isCollapsedGroupEvaluatedArticle(entry),
);

const processEvent = (state: ReadonlyArray<StateEntry>, event: DomainEvent) => pipe(
  // matching GroupIds
  // matching ArticleIds
  isEditorialCommunityReviewedArticleEvent(event)
    && isPreviousEntryRelevant(state)
    ? [...state, event]
    : [...state, event],
);

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<StateEntry> => events.reduce(processEvent, []);
