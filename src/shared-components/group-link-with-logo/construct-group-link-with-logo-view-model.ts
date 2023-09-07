import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as GID from '../../types/group-id';
import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import { ViewModel } from './view-model';

type ConstructGroupLinkWithLogoViewModelDependencies = Queries & { logger: Logger };

export const constructGroupLinkWithLogoViewModel = (
  dependencies: ConstructGroupLinkWithLogoViewModelDependencies,
) => (groupId: GID.GroupId): O.Option<ViewModel> => pipe(
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
