import { Ports as OwnedByPorts } from './owned-by';
import { Logger } from '../infrastructure/logger';
import { List } from '../shared-read-models/lists';
import { GroupId } from '../types/group-id';

type ListsReadModel = Map<GroupId, List>;

type LowLevelPorts = {
  logger: Logger,
  persisted: ListsReadModel,
};

export type Ports = OwnedByPorts & LowLevelPorts;
