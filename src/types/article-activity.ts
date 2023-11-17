import * as O from 'fp-ts/Option';
import { ArticleId } from './article-id.js';

export type ArticleActivity = {
  articleId: ArticleId,
  latestActivityAt: O.Option<Date>,
  evaluationCount: number,
  listMembershipCount: number,
};
