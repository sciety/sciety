import Doi from '../data/doi';

export default interface ReviewReferenceRepository {
  add(articleVersionDoi: Doi, reviewDoi: Doi): void;

  findReviewDoisForArticleVersionDoi(articleVersionDoi: Doi): Array<Doi>;
}
