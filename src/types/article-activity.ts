import { Doi } from './doi';

export type ArticleActivity = {
  doi: Doi,
  latestActivityDate: Date,
  evaluationCount: number,
};
