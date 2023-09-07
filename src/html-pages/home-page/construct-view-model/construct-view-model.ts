import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import * as GID from '../../../types/group-id';
import { Dependencies } from '../dependencies';
import { constructCurationTeasers } from './construct-curation-teasers';
import { constructGroupLinkWithLogo } from '../../../shared-components/group-link-with-logo';

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GID.GroupId,
}>;

export const constructViewModel = (dependencies: Dependencies, groupsToHighlight: GroupsToHighlight): ViewModel => pipe(
  groupsToHighlight,
  O.traverseArray((groupToHighlight) => pipe(
    groupToHighlight.groupId,
    constructGroupLinkWithLogo(dependencies),
  )),
  (groupsViewModel) => ({
    groups: groupsViewModel,
    curationTeasers: constructCurationTeasers(dependencies),
  }),
);
