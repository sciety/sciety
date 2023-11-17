import { articleActivity } from './article-activity/index.js';
import { evaluations } from './evaluations/index.js';
import { annotations } from './annotations/index.js';
import { followings } from './followings/index.js';
import { groupActivity } from './group-activity/index.js';
import { groups } from './groups/index.js';
import { idsOfEvalutedArticlesLists } from './ids-of-evaluated-articles-lists/index.js';
import { lists } from './lists/index.js';
import { users } from './users/index.js';
import { elifeSubjectAreaLists } from './elife-subject-area-lists/index.js';
import { evaluatedArticlesLists } from './evaluated-articles-lists/index.js';

const queries = {
  ...elifeSubjectAreaLists.queries,
  ...annotations.queries,
  ...articleActivity.queries,
  ...evaluations.queries,
  ...evaluatedArticlesLists.queries,
  ...followings.queries,
  ...groupActivity.queries,
  ...groups.queries,
  ...idsOfEvalutedArticlesLists.queries,
  ...lists.queries,
  ...users.queries,
};

export type Queries = { [K in keyof typeof queries]: ReturnType<typeof queries[K]> };
