import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EditorialCommunityReviewedArticleEvent } from '../types/domain-events';

import { GroupId } from '../types/group-id';

type ListDetails = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
};

export const getEvaluatedArticlesListDetails = (
  groupId: GroupId,
) => (
  events: ReadonlyArray<DomainEvent>,
): ListDetails => pipe(
  events,
  RA.filter((event): event is EditorialCommunityReviewedArticleEvent => event.type === 'EditorialCommunityReviewedArticle'),
  RA.filter((event) => event.editorialCommunityId === groupId),
  (evaluationEvents) => ({
    articleCount: pipe(
      evaluationEvents,
      RA.map((event) => event.articleId.value),
      (articleIds) => (new Set(articleIds)),
      RS.size,
    ),
    lastUpdated: pipe(
      evaluationEvents,
      RA.last,
      O.map((event) => event.date),
    ),
  }),
);
