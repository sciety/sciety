import { List } from '../shared-read-models/lists';
import { GroupId } from '../types/group-id';

type ListsReadModel = Map<GroupId, List>;

type ListenForNewEvents = (persisted: ListsReadModel) => void;

export const listenForNewEvents: ListenForNewEvents = () => undefined;
