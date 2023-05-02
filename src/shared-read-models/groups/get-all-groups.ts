import { ReadModel } from './handle-event';
import { Group } from '../../types/group';

export type GetAllGroups = () => ReadonlyArray<Group>;

export const getAllGroups = (readmodel: ReadModel): GetAllGroups => () => Object.values(readmodel);
