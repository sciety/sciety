import { ReadModel } from './handle-event';
import { Group } from '../../types/group';

export const getAllGroups = (readmodel: ReadModel) => (): ReadonlyArray<Group> => Object.values(readmodel);
