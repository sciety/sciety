import Doi from '../data/doi';

export default interface ReviewReferenceRepository {
  add(articleDoi: Doi, reviewDoi: string): void;

  findReviewDoisForArticleDoi(articleDoi: Doi): Array<string>;
}
