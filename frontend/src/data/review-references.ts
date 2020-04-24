import { article3, article4 } from './article-dois';
import ReviewReference from '../types/review-reference';

const reviewReferences: Array<ReviewReference> = [
  {
    articleDoi: article3,
    reviewDoi: '10.5281/zenodo.3678325',
  },
  {
    articleDoi: article4,
    reviewDoi: '10.5281/zenodo.3756961',
  },
];

export default reviewReferences;
