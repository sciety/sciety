import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import { ReviewId } from './review-id';

export default interface ReviewReference {
  articleVersionDoi: Doi;
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  added: Date;
}
