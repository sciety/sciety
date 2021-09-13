import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { isEditorialCommunityReviewedArticleEvent } from '../domain-events/type-guards';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type CollapsedGroupEvaluatedArticle = {
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: GroupId,
  articleId: Doi,
};

const processEvent = (state: ReadonlyArray<DomainEvent>, event: DomainEvent) => pipe(
  event,
  isEditorialCommunityReviewedArticleEvent,
  B.fold(
    () => [...state, event],
    () => [...state, event],
  ),
);

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<CollapsedGroupEvaluatedArticle | DomainEvent> => events.reduce(processEvent, []);
