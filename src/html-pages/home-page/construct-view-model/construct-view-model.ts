import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import * as GID from '../../../types/group-id';
import { Dependencies } from '../dependencies';
import { constructCurationTeasers } from './construct-curation-teasers';

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GID.GroupId,
}>;

export const constructViewModel = (dependencies: Dependencies, groupsToHighlight: GroupsToHighlight): ViewModel => pipe(
  groupsToHighlight,
  O.traverseArray((groupToHighlight) => pipe(
    groupToHighlight.groupId,
    dependencies.getGroup,
    O.map((group) => ({
      logoPath: group.largeLogoPath,
      href: `/groups/${group.slug}`,
      groupName: group.name,
    })),
  )),
  (groupsViewModel) => ({
    groups: groupsViewModel,
    curationTeasers: constructCurationTeasers(dependencies),
  }),
);
