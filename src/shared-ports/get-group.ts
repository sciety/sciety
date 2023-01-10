import * as O from 'fp-ts/Option';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

export type GetGroup = (groupId: GroupId) => O.Option<Group>;
