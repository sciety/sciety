import * as E from 'fp-ts/Either';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { DomainEvent, GroupCreatedEvent } from '../domain-events';
import { isGroupCreatedEvent } from '../domain-events/type-guards';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

const toGroup = (event: GroupCreatedEvent) => ({
  id: event.groupId,
  name: event.name,
  avatarPath: event.avatarPath,
  descriptionPath: event.descriptionPath,
  shortDescription: event.shortDescription,
  homepage: event.homepage,
  slug: event.slug,
});

type ReadModel = Map<GroupId, Group>;

const recordEvent = (rm: ReadModel, event: DomainEvent) => (
  isGroupCreatedEvent(event)
    ? rm.set(event.groupId, toGroup(event))
    : rm
);

type GetGroup = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => E.Either<DE.DataError, Group>;

export const getGroup: GetGroup = (groupId: GroupId) => flow(
  RA.reduce(new Map(), recordEvent),
  RM.lookup(S.Eq)(groupId),
  E.fromOption(() => DE.notFound),
);

const byName: Ord.Ord<Group> = pipe(
  S.Ord,
  Ord.contramap((group) => group.name),
);

type GetGroupBySlug = (slug: string) => (events: ReadonlyArray<DomainEvent>) => E.Either<DE.DataError, Group>;

export const getGroupBySlug: GetGroupBySlug = (slug: string) => flow(
  RA.reduce(new Map(), recordEvent),
  RM.values(byName),
  RA.findFirst((group) => group.slug === slug),
  E.fromOption(() => DE.notFound),
);
