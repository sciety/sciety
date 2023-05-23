import * as O from 'fp-ts/Option';
import { ViewModel } from '../render-home-page';
import { cards, Ports as CardsPorts } from '../cards';
import { GroupId } from '../../../types/group-id';

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GroupId,
  logoPath: string,
}>;

export type Ports = CardsPorts;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (ports: Ports, groupsToHighlight: GroupsToHighlight): ViewModel => ({
  groups: O.none,
  cards: cards(ports),
});
