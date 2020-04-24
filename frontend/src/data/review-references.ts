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

export interface ReviewReferenceRepository {
  findReviewDoisForArticleDoi(articleDoi: string): Array<string>;
}

export default const reviewReferenceRepository: ReviewReferenceRepository = {
  findReviewDoisForArticleDoi: (articleDoi) => (
    reviewReferences.filter((reference) => reference.articleDoi === articleDoi).map((reference) => reference.reviewDoi)
  ),
};
