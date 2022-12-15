import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports as GetUserOwnerInformationPorts } from './get-user-owner-information';
import { ViewModel } from './header/render-component';
import { GetAllEvents, GetGroup } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { List } from '../../types/list';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export type Ports = GetUserOwnerInformationPorts
& {
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
};

const getGroupOwnerInformation = (ports: Ports) => (groupId: GroupId) => pipe(
  ports.getGroup(groupId),
  E.map((group) => ({
    ownerName: group.name,
    ownerHref: `/groups/${group.slug}`,
    ownerAvatarPath: group.avatarPath,
  })),
  TE.fromEither,
);

type Headers = (ports: Ports) => (list: List, loggedInUserId: O.Option<UserId>)
=> TE.TaskEither<DE.DataError, ViewModel>;

export const headers: Headers = (ports) => (list, loggedInUserId) => pipe(
  {
    ...list,
    articleCount: list.articleIds.length,
  },
  TE.right,
  TE.chain((partial) => pipe(
    partial.ownerId,
    (ownerId) => {
      switch (ownerId.tag) {
        case 'group-id':
          return getGroupOwnerInformation(ports)(ownerId.value);
        case 'user-id':
          return getUserOwnerInformation(ports)(ownerId.value);
      }
    },
    TE.map((ownerInformation) => ({
      ...partial,
      ...ownerInformation,
      editCapability: pipe(
        loggedInUserId,
        O.filter((userId) => LOID.eqListOwnerId.equals(LOID.fromUserId(userId), list.ownerId)),
        O.map(() => list.listId),
      ),
    })),
  )),
);
