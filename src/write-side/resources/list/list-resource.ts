import { Doi } from '../../../types/doi';

export type ListResource = {
  articleIds: Array<Doi>,
  name: string,
  description: string,
};
