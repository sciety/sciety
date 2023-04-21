import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ErrorMessage } from '../../types/error-message';
import * as LID from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { AddGroupCommand } from '../commands';
import {
  DomainEvent, evaluatedArticlesListSpecified, groupJoined, listCreated,
} from '../../domain-events';
import * as AG from '../resources/all-groups';

type ExecuteCommand = (command: AddGroupCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  AG.replay(events),
  AG.check(command),
  E.map(LID.generate),
  E.map((listId) => [
    groupJoined(
      command.groupId,
      command.name,
      command.avatarPath,
      command.descriptionPath,
      command.shortDescription,
      command.homepage,
      command.slug,
    ),
    listCreated(
      listId,
      'Evaluated articles',
      `Articles that have been evaluated by ${command.name}`,
      LOID.fromGroupId(command.groupId),
    ),
    evaluatedArticlesListSpecified(listId, command.groupId),
  ]),
);
