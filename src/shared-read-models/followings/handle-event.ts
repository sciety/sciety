/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, ReadonlyArray<GroupId>>;

// ts-unused-exports:disable-next-line
export const initialState = (): ReadModel => ({});

// ts-unused-exports:disable-next-line
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
