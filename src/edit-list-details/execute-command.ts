import { EditListDetailsCommand } from '../commands';
import { DomainEvent } from '../domain-events';
import { ListAggregate } from '../shared-write-models/list-aggregate';

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listAggregate: ListAggregate)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = () => () => [];
