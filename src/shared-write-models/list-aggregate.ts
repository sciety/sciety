import { Doi } from '../types/doi';

export type ListAggregate = {
  articleIds: ReadonlyArray<Doi>,
  name: string,
};
