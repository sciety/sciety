/* eslint-disable no-param-reassign */
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

export type ReadModel = Map<GroupId, Array<ListId>>;

export const initialState = (): ReadModel => new Map<GroupId, Array<ListId>>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
