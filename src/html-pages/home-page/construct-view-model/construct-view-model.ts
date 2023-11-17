import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model.js';
import * as GID from '../../../types/group-id.js';
import { Dependencies } from '../dependencies.js';
import { constructCurationTeasers } from './construct-curation-teasers.js';
import { constructGroupLink } from '../../../shared-components/group-link/index.js';

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
  groups: constructGroups(dependencies, groupsToHighlight),
  curationTeasers: constructCurationTeasers(dependencies),
});
