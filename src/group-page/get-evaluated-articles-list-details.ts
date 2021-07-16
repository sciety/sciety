import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
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
    RA.map((event) => event.articleId.value),
    (articleIds) => (new Set(articleIds)),
    RS.size,
  ),
});
