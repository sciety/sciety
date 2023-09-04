import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructReviewingGroups = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependencies: Dependencies,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  articleId: Doi,
): ViewModel['reviewingGroups'] => ['eLife'];
