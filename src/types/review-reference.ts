import Doi from './doi';
import { ReviewId } from './review-id';

export default interface ReviewReference {
  articleVersionDoi: Doi;
  reviewId: ReviewId;
  editorialCommunityId: string;
  added: Date;
}
