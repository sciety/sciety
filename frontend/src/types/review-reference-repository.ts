export default interface ReviewReferenceRepository {
  findReviewDoisForArticleDoi(articleDoi: string): Array<string>;
}
