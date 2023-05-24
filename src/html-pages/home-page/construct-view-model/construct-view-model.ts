import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import { Ports as CardsPorts } from '../cards';
import { GroupId } from '../../../types/group-id';
import { renderCardsSection } from '../cards/render-cards-section';

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GroupId,
  logoPath: string,
}>;

export type Ports = CardsPorts;

export const constructViewModel = (ports: Ports, groupsToHighlight: GroupsToHighlight): ViewModel => pipe(
  groupsToHighlight,
  O.traverseArray((groupToHighlight) => pipe(
    groupToHighlight.groupId,
    ports.getGroup,
    O.map((group) => ({
      logoPath: groupToHighlight.logoPath,
      link: `/groups/${group.slug}`,
      name: group.name,
    })),
  )),
  (groupsViewModel) => ({
    groups: groupsViewModel,
    cards: renderCardsSection(),
  }),
);
