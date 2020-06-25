import { ReviewId } from './review-id';
import Doi from '../data/doi';

export default interface ReviewReference {
  articleVersionDoi: Doi;
  reviewId: ReviewId;
  editorialCommunityId: string;
  added: Date;
}
