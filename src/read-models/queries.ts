import { annotations } from './annotations';
import { articleActivity } from './article-activity';
import { elifeSubjectAreaLists } from './elife-subject-area-lists';
import { evaluatedArticlesLists } from './evaluated-articles-lists';
import { evaluations } from './evaluations';
import { followings } from './followings';
import { groupActivity } from './group-activity';
import { groupAuthorisations } from './group-authorisations';
import { groups } from './groups';
import { idsOfEvalutedArticlesLists } from './ids-of-evaluated-articles-lists';
import { lists } from './lists';
import { users } from './users';

const queries = {
  ...elifeSubjectAreaLists.queries,
  ...annotations.queries,
  ...articleActivity.queries,
  ...evaluations.queries,
  ...evaluatedArticlesLists.queries,
  ...followings.queries,
  ...groupActivity.queries,
  ...groupAuthorisations.queries,
  ...groups.queries,
  ...idsOfEvalutedArticlesLists.queries,
  ...lists.queries,
  ...users.queries,
};

export type Queries = { [K in keyof typeof queries]: ReturnType<typeof queries[K]> };
