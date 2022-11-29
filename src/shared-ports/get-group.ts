import * as E from 'fp-ts/Either';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

export type GetGroup = (groupId: GroupId) => E.Either<DE.DataError, Group>;
