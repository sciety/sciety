import { ReadModel } from './handle-event.js';
import { Group } from '../../types/group.js';

type GetAllGroups = () => ReadonlyArray<Group>;

export const getAllGroups = (readmodel: ReadModel): GetAllGroups => () => Object.values(readmodel);
