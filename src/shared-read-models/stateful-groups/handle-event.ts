import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

// eslint-disable-next-line @typescript-eslint/ban-types
type GroupState = {};
type ReadModel = Record<GroupId, GroupState>;

export const initialState = (): ReadModel => ({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
