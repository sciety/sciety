import * as E from 'fp-ts/Either';
import { DomainEvent } from '../domain-events';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

type GetGroup = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => E.Either<DE.DataError, Group>;

export const getGroup: GetGroup = () => () => E.left(DE.notFound);

type GetGroupBySlug = (slug: string) => (events: ReadonlyArray<DomainEvent>) => E.Either<DE.DataError, Group>;

export const getGroupBySlug: GetGroupBySlug = () => () => E.left(DE.notFound);
