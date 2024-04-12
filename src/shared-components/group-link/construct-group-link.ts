import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as GID from '../../types/group-id';
import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import { GroupLinkWithLogoViewModel } from './group-link-with-logo-view-model';
import { GroupLinkAsTextViewModel } from './group-link-as-text-view-model';
import { groupPageHref } from '../../read-side/group-page-href';

export type ConstructGroupLinkDependencies = Queries & { logger: Logger };

export const constructGroupLink = (
  dependencies: ConstructGroupLinkDependencies,
) => (groupId: GID.GroupId): O.Option<GroupLinkWithLogoViewModel & GroupLinkAsTextViewModel> => pipe(
  groupId,
  dependencies.getGroup,
  O.orElse(() => {
    dependencies.logger('error', 'Group missing from readmodel', { groupId });
    return O.none;
  }),
  O.map((foundGroup) => ({
    href: groupPageHref(foundGroup),
    groupName: foundGroup.name,
    logoPath: foundGroup.largeLogoPath,
  })),
);
