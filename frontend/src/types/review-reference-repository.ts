import Doi from '../data/doi';

export default interface ReviewReferenceRepository {
  add(articleDoi: Doi, reviewDoi: Doi): void;

  findReviewDoisForArticleDoi(articleDoi: Doi): Array<Doi>;
}
