import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EditorialCommunityReviewedArticleEvent } from '../types/domain-events';

import { GroupId } from '../types/group-id';

type ListDetails = {
  articleCount: number,
};

export const getEvaluatedArticlesListDetails = (
  groupId: GroupId,
) => (
  events: ReadonlyArray<DomainEvent>,
): ListDetails => ({
  articleCount: pipe(
    events,
    RA.filter((event): event is EditorialCommunityReviewedArticleEvent => event.type === 'EditorialCommunityReviewedArticle'),
    RA.filter((event) => event.editorialCommunityId === groupId),
    (es) => es.length,
  ),
});
