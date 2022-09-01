import * as T from 'fp-ts/Task';
import { GroupsReadModel } from '../shared-read-models/groups';

export type GetGroupsReadModel = T.Task<GroupsReadModel>;
