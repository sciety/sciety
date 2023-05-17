import * as E from 'fp-ts/Either';
import { UpdateGroupDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';
import { constructEvent } from '../../../domain-events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => (
  E.right([constructEvent('GroupDetailsUpdated')({
    groupId: command.groupId,
    name: command.name,
    shortDescription: undefined,
    homepage: undefined,
    avatarPath: undefined,
    descriptionPath: undefined,
    slug: undefined,
  })])
);
