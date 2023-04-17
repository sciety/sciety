import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import {
  GetNonEmptyUserLists, GetGroup, LookupUser, Logger,
} from '../../../shared-ports';
import { List } from '../../../types/list';
import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';

type AddListOwnershipInformationPorts = {
  lookupUser: LookupUser,
  getGroup: GetGroup,
  logger: Logger,
};

export type Ports = AddListOwnershipInformationPorts & {
  getNonEmptyUserLists: GetNonEmptyUserLists,
};

type ListWithAddedOwnershipInformation = {
  ownerAvatarUrl: string,
};

const addListOwnershipInformation = (
  ports: Ports,
) => (
  list: List,
): ListWithAddedOwnershipInformation => {
  switch (list.ownerId.tag) {
    case 'group-id':
      return pipe(
        ports.getGroup(list.ownerId.value),
        O.match(
          () => {
            ports.logger('error', 'Could not find group that owns list', {
              listId: list.id,
              ownerId: list.ownerId,
            });
            return {
              ownerAvatarUrl: '/static/images/sciety-logo.jpg',
            };
          },
          (group) => ({
            ownerAvatarUrl: group.avatarPath,
          }),
        ),
      );
    case 'user-id':
      return pipe(
        list.ownerId.value,
        ports.lookupUser,
        O.match(
          () => {
            ports.logger('error', 'Could not find user who owns list', {
              listId: list.id,
              ownerId: list.ownerId,
            });
            return {
              ownerAvatarUrl: '/static/images/sciety-logo.jpg',
            };
          },
          (userDetails) => (
            {
              ownerAvatarUrl: userDetails.avatarUrl,
            }
          ),
        ),
      );
  }
};

const constructListCardViewModel = (ports: Ports) => (list: List): ListCardViewModel => pipe(
  list,
  addListOwnershipInformation(ports),
  (ownershipInformation) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    avatarUrl: O.some(ownershipInformation.ownerAvatarUrl),
  }),
);

export const constructViewModel = (ports: Ports) => pipe(
  ports.getNonEmptyUserLists(),
  RA.map(constructListCardViewModel(ports)),
);
