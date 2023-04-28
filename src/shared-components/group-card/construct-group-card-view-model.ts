import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { GroupViewModel } from './render-group-card';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { sanitise } from '../../types/sanitised-html-fragment';
import { Queries } from '../../shared-read-models';

export type Ports = Queries;

export const constructGroupCardViewModel = (
  ports: Ports,
) => (
  groupId: GroupId,
): E.Either<DE.DataError, GroupViewModel> => pipe(
  ports.getGroup(groupId),
  E.fromOption(() => DE.notFound),
  E.chainOptionK(() => DE.notFound)((group) => pipe(
    group.id,
    ports.getActivityForGroup,
    O.map((meta) => ({
      ...group,
      ...meta,
      followerCount: ports.getFollowers(group.id).length,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
    })),
  )),
  E.map((partial) => pipe(
    groupId,
    LOID.fromGroupId,
    ports.selectAllListsOwnedBy,
    RA.size,
    ((listCount) => ({
      ...partial,
      listCount,
    })),
  )),
);
