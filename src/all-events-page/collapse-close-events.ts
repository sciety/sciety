import { DomainEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type CollapsedGroupEvaluatedArticle = {
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: GroupId,
  articleId: Doi,
};

const processEvent = (state: ReadonlyArray<DomainEvent>, event: DomainEvent) => state.concat([event]);

export const collapseCloseEvents = (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<CollapsedGroupEvaluatedArticle | DomainEvent> => events.reduce(processEvent, []);
