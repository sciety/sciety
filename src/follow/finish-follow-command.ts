import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { CommitEvents, followCommand } from './follow-command';
import { DomainEvent } from '../domain-events';
import * as GroupId from '../types/group-id';
import { User } from '../types/user';

export const sessionGroupProperty = 'groupId';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

export const finishFollowCommand = (ports: Ports) => (g: string, user: User): TO.TaskOption<void> => pipe(
  g,
  GroupId.fromNullable,
  TO.fromOption,
  TO.chainTaskK((groupId) => followCommand(
    createEventSourceFollowListRepository(ports.getAllEvents),
    ports.commitEvents,
  )(user, groupId)),
);
