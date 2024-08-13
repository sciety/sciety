import { annotations } from './annotations';
import { evaluatedArticlesLists } from './evaluated-articles-lists';
import { evaluations } from './evaluations';
import { followings } from './followings';
import { groupActivity } from './group-activity';
import { groupAuthorisations } from './group-authorisations';
import { groups } from './groups';
import { idsOfEvalutedArticlesLists } from './ids-of-evaluated-articles-lists';
import { lists } from './lists';
import { papersEvaluatedByGroup } from './papers-evaluated-by-group';
import { users } from './users';

const queries = {
  ...annotations.queries,
  ...evaluations.queries,
  ...evaluatedArticlesLists.queries,
  ...followings.queries,
  ...groupActivity.queries,
  ...groupAuthorisations.queries,
  ...groups.queries,
  ...idsOfEvalutedArticlesLists.queries,
  ...lists.queries,
  ...users.queries,
  ...papersEvaluatedByGroup.queries,
};

export type Queries = { [K in keyof typeof queries]: ReturnType<typeof queries[K]> };
