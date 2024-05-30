/* eslint-disable no-param-reassign */
import { DomainEvent } from '../../../../domain-events';
import { GroupId } from '../../../../types/group-id';
import { GroupCardViewModel as GroupCard } from '../../shared-components/group-card';

export type ReadModel = Record<GroupId, GroupCard>;

export const initialState = (): ReadModel => ({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
