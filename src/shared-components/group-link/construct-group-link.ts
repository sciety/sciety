import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as GID from '../../types/group-id.js';
import { Queries } from '../../read-models/index.js';
import { Logger } from '../../shared-ports/index.js';
import { GroupLinkWithLogoViewModel } from './group-link-with-logo-view-model.js';
import { GroupLinkAsTextViewModel } from './group-link-as-text-view-model.js';

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
    href: `/groups/${foundGroup.slug}`,
    groupName: foundGroup.name,
    logoPath: foundGroup.largeLogoPath,
  })),
);
