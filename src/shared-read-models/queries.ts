import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import * as annotations from './annotations';
import * as followings from './followings';
import * as groupActivity from './group-activity';
import * as groups from './groups';
import * as idsOfEvaluatedArticlesLists from './ids-of-evaluated-articles-lists';
import * as lists from './lists';
import * as users from './users';
import { curationStatements } from './curation-statements';
import { articleActivity } from './article-activity';
import { evaluations } from './evaluations';

export type Queries = addArticleToElifeSubjectAreaList.Queries
& annotations.Queries
& followings.Queries
& groupActivity.Queries
& groups.Queries
& idsOfEvaluatedArticlesLists.Queries
& lists.Queries
& users.Queries
& { [K in keyof typeof articleActivity.queries]: ReturnType<typeof articleActivity.queries[K]> }
& { [K in keyof typeof evaluations.queries]: ReturnType<typeof evaluations.queries[K]> }
& { [K in keyof typeof curationStatements.queries]: ReturnType<typeof curationStatements.queries[K]> };
