import Doi from '../../src/data/doi';
import createAdapter, { FetchArticle } from '../../src/editorial-community-page/get-reviewed-articles-from-review-references';
import ReviewReference from '../../src/types/review-reference';

const fetchArticle: FetchArticle = async (doi) => ({
  doi,
  title: `Title of ${doi.value}`,
});

describe('get-reviewed-articles-from-review-references', (): void => {
  it('returns articles for each given review reference', async (): Promise<void> => {
    const findReviewReferences = async (): Promise<ReadonlyArray<ReviewReference>> => [
      {
        articleVersionDoi: new Doi('10.1111/1111'),
        reviewId: new Doi('10.3333/3333'),
        editorialCommunityId: '1',
        added: new Date(),
      },
      {
        articleVersionDoi: new Doi('10.2222/2222'),
        reviewId: new Doi('10.3333/3333'),
        editorialCommunityId: '1',
        added: new Date(),
      },
    ];
    const getReviewedArticles = createAdapter(findReviewReferences, fetchArticle);
    const articles = await getReviewedArticles('1');

    expect(articles).toHaveLength(2);
    expect(articles.map((article) => article.title)).toContain('Title of 10.1111/1111');
    expect(articles.map((article) => article.title)).toContain('Title of 10.2222/2222');
  });

  it('returns articles only once', async (): Promise<void> => {
    const findReviewReferences = async (): Promise<ReadonlyArray<ReviewReference>> => [
      {
        articleVersionDoi: new Doi('10.1111/1111'),
        reviewId: new Doi('10.3333/3333'),
        editorialCommunityId: '2',
        added: new Date(),
      },
      {
        articleVersionDoi: new Doi('10.1111/1111'),
        reviewId: new Doi('10.4444/4444'),
        editorialCommunityId: '2',
        added: new Date(),
      },
    ];
    const getReviewedArticles = createAdapter(findReviewReferences, fetchArticle);
    const articles = await getReviewedArticles('2');

    expect(articles).toHaveLength(1);
  });
});
