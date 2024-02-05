import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import * as GID from '../../../types/group-id';
import { Dependencies } from '../dependencies';
import { constructCurationTeasers } from './construct-curation-teasers';
import { constructGroupLink } from '../../../shared-components/group-link';

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GID.GroupId,
}>;

const constructGroups = (dependencies: Dependencies, groupsToHighlight: GroupsToHighlight) => pipe(
  groupsToHighlight,
  O.traverseArray((groupToHighlight) => pipe(
    groupToHighlight.groupId,
    constructGroupLink(dependencies),
  )),
);

export const constructViewModel = (dependencies: Dependencies, groupsToHighlight: GroupsToHighlight): ViewModel => ({
  pageHeading: 'The home of public preprint evaluation',
  groups: constructGroups(dependencies, groupsToHighlight),
  curationTeasers: constructCurationTeasers(dependencies),
});
