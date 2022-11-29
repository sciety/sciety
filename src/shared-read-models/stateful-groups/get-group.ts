import * as E from 'fp-ts/Either';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

type GetGroup = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => E.Either<DE.DataError, Group>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getGroup: GetGroup = (groupId: GroupId) => () => E.left(DE.notFound);
