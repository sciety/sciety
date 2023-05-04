import { GetArticleIdsByState, getArticleIdsByState } from './get-article-ids-by-state';
import { GetOneArticleIdInEvaluatedState, getOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
import { getOneArticleReadyToBeListed } from './get-one-article-ready-to-be-listed';
import { ReadModel } from './handle-event';
import { GetOneArticleReadyToBeListed } from '../../shared-ports';

export type Queries = {
  getArticleIdsByState: GetArticleIdsByState,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
  getOneArticleReadyToBeListed: GetOneArticleReadyToBeListed,
};

export const queries = (instance: ReadModel): Queries => ({
  getArticleIdsByState: getArticleIdsByState(instance),
  getOneArticleIdInEvaluatedState: getOneArticleIdInEvaluatedState(instance),
  getOneArticleReadyToBeListed: getOneArticleReadyToBeListed(instance),
});
