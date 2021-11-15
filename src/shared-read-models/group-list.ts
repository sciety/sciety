import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../domain-events';
import { GroupId } from '../types/group-id';

// ts-unused-exports:disable-next-line
export type ListDetails = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
};

export const groupList = (
  groupId: GroupId,
) => (
  events: ReadonlyArray<DomainEvent>,
): TE.TaskEither<never, ListDetails> => pipe(
  events,
  RA.filter((event): event is GroupEvaluatedArticleEvent => event.type === 'GroupEvaluatedArticle'),
  RA.filter((event) => event.groupId === groupId),
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
  TE.right,
);
