import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import * as annotations from './annotations';
import * as evaluations from './evaluations';
import * as curationStatements from './curation-statements';
import * as followings from './followings';
import * as groupActivity from './group-activity';
import * as groups from './groups';
import * as idsOfEvaluatedArticlesLists from './ids-of-evaluated-articles-lists';
import * as lists from './lists';
import * as users from './users';
import * as articleActivity from './article-activity';

export type Queries = addArticleToElifeSubjectAreaList.Queries
& annotations.Queries
& articleActivity.Queries
& curationStatements.Queries
& evaluations.Queries
& followings.Queries
& groupActivity.Queries
& groups.Queries
& idsOfEvaluatedArticlesLists.Queries
& lists.Queries
& users.Queries;
