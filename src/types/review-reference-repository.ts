import Doi from '../data/doi';

interface Review {
  reviewDoi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export default interface ReviewReferenceRepository {
  add(articleVersionDoi: Doi, reviewDoi: Doi, editorialCommunityId: string, editorialCommunityName: string): void;

  findReviewsForArticleVersionDoi(articleVersionDoi: Doi): Array<Review>;
}
