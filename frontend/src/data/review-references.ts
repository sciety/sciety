import { article3, article4 } from './article-dois';
import { article3Review1, article4Review1 } from './review-dois';
import ReviewReference from '../types/review-reference';

const reviewReferences: Array<ReviewReference> = [
  {
    articleDoi: article3,
    reviewDoi: article3Review1,
  },
  {
    articleDoi: article4,
    reviewDoi: article4Review1,
  },
];

export default reviewReferences;
