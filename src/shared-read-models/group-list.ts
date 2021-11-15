import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../domain-events';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

// ts-unused-exports:disable-next-line
export type Ports = {
  getGroup: (groupId: GroupId) => TE.TaskEither<DE.DataError, Group>,
};

// ts-unused-exports:disable-next-line
export type ListDetails = {
  name: string,
  description: string,
  articleCount: number,
  lastUpdated: O.Option<Date>,
};

const defaultGroupListDescription = (groupName: string): string => (
  `Articles that have been evaluated by ${groupName}.`
);

export const groupList = (
  ports: Ports,
  groupId: GroupId,
) => (
  events: ReadonlyArray<DomainEvent>,
): TE.TaskEither<DE.DataError, ListDetails> => pipe(
  events,
  RA.filter((event): event is GroupEvaluatedArticleEvent => event.type === 'GroupEvaluatedArticle'),
  RA.filter((event) => event.groupId === groupId),
  (evaluationEvents) => ({
    name: 'Evaluated articles',
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
  TE.chain((partial) => pipe(
    groupId,
    ports.getGroup,
    TE.map((group) => ({
      ...partial,
      description: defaultGroupListDescription(group.name),
    })),
  )),
);
