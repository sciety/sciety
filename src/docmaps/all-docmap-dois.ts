import { DomainEvent } from '../domain-events';
import * as Doi from '../types/doi';
import { GroupId } from '../types/group-id';

type AllDocmapDois = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Doi.Doi>;

export const allDocmapDois: AllDocmapDois = () => () => [
  new Doi.Doi('10.1101/2021.03.13.21253515'),
];
