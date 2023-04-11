import { Doi } from '../../../types/doi';

export type ListResource = {
  articleIds: ReadonlyArray<Doi>,
  name: string,
  description: string,
};
