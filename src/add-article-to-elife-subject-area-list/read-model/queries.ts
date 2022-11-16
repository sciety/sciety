import { getArticleIdsByState } from './get-article-ids-by-state';
import { getOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
import { ReadModel } from './handle-event';
import { GetArticleIdsByState } from '../../shared-ports';
import { GetOneArticleIdInEvaluatedState } from '../discover-elife-article-subject-area';

export type Queries = {
  getArticleIdsByState: GetArticleIdsByState,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
};

export const queries = (instance: ReadModel): Queries => ({
  getArticleIdsByState: getArticleIdsByState(instance),
  getOneArticleIdInEvaluatedState: getOneArticleIdInEvaluatedState(instance),
});
