import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RS from 'fp-ts/ReadonlySet';
import * as R from 'fp-ts/Record';
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
  ownerName: string,
  ownerAvatarPath: string,
  ownerHref: string,
  articleCount: number,
  lastUpdated: O.Option<Date>,
};

const defaultGroupListDescription = (groupName: string): string => (
  `Articles that have been evaluated by ${groupName}.`
);

const createListPartial = (evaluationEvents: ReadonlyArray<GroupEvaluatedArticleEvent>) => ({
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
});

type ListPartial = {
  name: string,
  articleCount: number,
  lastUpdated: O.Option<Date>,
};

const augmentWithOwnerDetails = (ports: Ports, groupId: GroupId) => (partial: ListPartial) => pipe(
  groupId,
  ports.getGroup,
  TE.map((group) => ({
    ...partial,
    description: defaultGroupListDescription(group.name),
    ownerName: group.name,
    ownerAvatarPath: group.avatarPath,
    ownerHref: `/groups/${group.slug}`,
  })),
);

export const allLists = (
  ports: Ports,
  groupId: GroupId,
) => (
  events: ReadonlyArray<DomainEvent>,
): TE.TaskEither<DE.DataError, ListDetails> => pipe(
  events,
  RA.filter((event): event is GroupEvaluatedArticleEvent => event.type === 'GroupEvaluatedArticle'),
  RA.reduce(
    {} as Record<string, Array<GroupEvaluatedArticleEvent>>,
    (accumulator, event) => {
      if (accumulator[event.groupId]) {
        accumulator[event.groupId].push(event);
      } else {
        accumulator[event.groupId] = [event];
      }
      return accumulator;
    },
  ),
  R.map(createListPartial),
  (allListPartials) => allListPartials[groupId] ?? createListPartial([]),
  TE.right,
  TE.chain(augmentWithOwnerDetails(ports, groupId)),
);
