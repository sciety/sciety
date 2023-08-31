import { articleActivity } from './article-activity';
import { evaluations } from './evaluations';
import { annotations } from './annotations';
import { followings } from './followings';
import { groupActivity } from './group-activity';
import { groups } from './groups';
import { idsOfEvalutedArticlesLists } from './ids-of-evaluated-articles-lists';
import { lists } from './lists';
import { users } from './users';
import { addArticleToElifeSubjectAreaList } from '../add-article-to-elife-subject-area-list/read-model';
import { evaluatedArticlesLists } from './evaluated-articles-lists';

const queries = {
  ...addArticleToElifeSubjectAreaList.queries,
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
