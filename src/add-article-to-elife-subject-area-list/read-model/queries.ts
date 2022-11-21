import { getArticleIdsByState } from './get-article-ids-by-state';
import { getOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
import { getOneArticleReadyToBeListed } from './get-one-article-ready-to-be-listed';
import { ReadModel } from './handle-event';
import { GetArticleIdsByState } from '../../shared-ports';
import { GetOneArticleReadyToBeListed } from '../add-article-to-elife-subject-area-lists-saga';
import { GetOneArticleIdInEvaluatedState } from '../discover-elife-article-subject-area';

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
