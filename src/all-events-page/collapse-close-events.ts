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

const collapsesIntoPreviousEvent = (
  state: ReadonlyArray<StateEntry>, event: EditorialCommunityReviewedArticleEvent,
) => state.length && pipe(
  state[state.length - 1],
  (entry) => {
    if (isEditorialCommunityReviewedArticleEvent(entry)) {
      return entry.editorialCommunityId === event.editorialCommunityId
        && entry.articleId.value === event.articleId.value;
    }
    if (isCollapsedGroupEvaluatedArticle(entry)) {
      return entry.groupId === event.editorialCommunityId
        && entry.articleId.value === event.articleId.value;
    }
    return false;
  },
);

const replaceWithCollapseEvent = (state: ReadonlyArray<StateEntry>) => {
  const last = state[state.length - 1];
  const head = state.slice(0, -1);
  let replacement = last;
  if (isEditorialCommunityReviewedArticleEvent(last)) {
    replacement = {
      type: 'CollapsedGroupEvaluatedArticle' as const,
      articleId: last.articleId,
      groupId: last.editorialCommunityId,
    };
  }
  return [
    ...head,
    replacement,
  ];
};

const processEvent = (
  state: ReadonlyArray<StateEntry>, event: DomainEvent,
) => (isEditorialCommunityReviewedArticleEvent(event)
    && collapsesIntoPreviousEvent(state, event)
  ? replaceWithCollapseEvent(state)
  : [...state, event]);

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<StateEntry> => events.reduce(processEvent, []);
