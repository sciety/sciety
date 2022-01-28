import * as O from 'fp-ts/Option';
import { Doi } from './doi';

export type ArticleActivity = {
  articleId: Doi,
  latestActivityDate: O.Option<Date>,
  evaluationCount: number,
  listMembershipCount: number,
};
