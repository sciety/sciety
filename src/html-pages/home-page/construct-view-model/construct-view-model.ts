import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../render-home-page';
import { cards, Ports as CardsPorts } from '../cards';
import { GroupId } from '../../../types/group-id';

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GroupId,
  logoPath: string,
}>;

export type Ports = CardsPorts;

export const constructViewModel = (ports: Ports, groupsToHighlight: GroupsToHighlight): ViewModel => pipe(
  groupsToHighlight,
  O.traverseArray((groupToHighlight) => ports.getGroup(groupToHighlight.groupId)),
  O.map(RA.map((group) => ({
    link: `/groups/${group.slug}`,
    logoPath: '',
    name: group.name,
  }))),
  (groups) => ({
    groups,
    cards: cards(ports),
  }),
);
