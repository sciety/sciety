import * as O from 'fp-ts/Option';
import { Doi } from './doi';

export type ArticleActivity = {
  articleId: Doi,
  latestActivityAt: O.Option<Date>,
  evaluationCount: number,
  listMembershipCount: number,
};
