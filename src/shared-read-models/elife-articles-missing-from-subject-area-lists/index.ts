import { Doi } from '../../types/doi';

type MissingArticles = { articleIds: ReadonlyArray<Doi> };

export const elifeArticleMissingFromSubjectAreaLists = (): MissingArticles => (
  { articleIds: [new Doi('10.1101/1234')] }
);
