import * as T from 'fp-ts/Task';
import { DomainEvent } from '../domain-events';

type Ports = {
};

type Backfill = (ports: Ports, events: ReadonlyArray<DomainEvent>) => T.Task<void>;

export const backfillListsForUsersWithoutLists: Backfill = () => T.of(undefined);
