import { Doi } from '../types/doi';

type ListId = string;

type List = ReadonlyArray<Doi>;

export const lists: Record<ListId, List> = {
  'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7': [
    new Doi('10.1101/2021.05.20.21257512'),
  ],
  '5ac3a439-e5c6-4b15-b109-92928a740812': [
    new Doi('10.1101/2021.03.21.436299'),
    new Doi('10.1101/2021.07.05.451181'),
  ],
};
