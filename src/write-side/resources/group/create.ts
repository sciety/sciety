import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as LID from '../../../types/list-id.js';
import * as LOID from '../../../types/list-owner-id.js';
import { AddGroupCommand } from '../../commands/index.js';
import { constructEvent } from '../../../domain-events/index.js';
import * as AG from '../all-groups.js';
import { ResourceAction } from '../resource-action.js';

export const create: ResourceAction<AddGroupCommand> = (command) => (events) => pipe(
  AG.replay(events),
  AG.check(command),
  E.map(LID.generate),
  E.map((listId) => [
    constructEvent('GroupJoined')(command),
    constructEvent('ListCreated')({
      listId,
      name: 'Evaluated articles',
      description: `Articles that have been evaluated by ${command.name}`,
      ownerId: LOID.fromGroupId(command.groupId),
    }),
    constructEvent('EvaluatedArticlesListSpecified')({ listId, groupId: command.groupId }),
  ]),
);
