import { article3, article4 } from './article-dois';
import { article3Review1, article4Review1 } from './review-dois';
import ReviewReference from '../types/review-reference';
import ReviewReferenceRepository from '../types/review-reference-repository';

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

const reviewReferenceRepository: ReviewReferenceRepository = {
  findReviewDoisForArticleDoi: (articleDoi) => (
    reviewReferences.filter((reference) => reference.articleDoi === articleDoi).map((reference) => reference.reviewDoi)
  ),
};

export default reviewReferenceRepository;
