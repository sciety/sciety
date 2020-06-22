import Doi from '../../src/data/doi';
import createReviewReferenceRepository from '../../src/data/in-memory-review-references';
import createAdapter, { FetchArticle } from '../../src/editorial-community-page/get-reviewed-articles-from-review-references';

const articleAReview1 = new Doi('10.5281/zenodo.222222');
const articleAReview2 = new Doi('10.5281/zenodo.444444');
const articleAReview3 = new Doi('10.5281/zenodo.555555');
const articleBReview1 = new Doi('10.5281/zenodo.333333');
const articleCReview1 = new Doi('10.5281/zenodo.666666');

const reviewReferenceRepository = createReviewReferenceRepository();
reviewReferenceRepository.add(new Doi('10.1111/1111'), articleAReview1, '1', new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(new Doi('10.1111/1111'), articleAReview2, '2', new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(new Doi('10.1111/1111'), articleAReview3, '2', new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(new Doi('10.2222/2222'), articleBReview1, '1', new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(new Doi('10.3333/3333'), articleCReview1, '3', new Date('2020-05-19T14:00:00Z'));

describe('get-reviewed-articles-from-review-references', (): void => {
  it('returns only the articles reviewed by the requested editorial community', async (): Promise<void> => {
    const fetchArticle: FetchArticle = async (doi) => ({
      doi,
      title: `Title of ${doi.value}`,
    });
    const getReviewedArticles = createAdapter(
      reviewReferenceRepository.findReviewsForEditorialCommunityId,
      fetchArticle,
    );
    const articles = await getReviewedArticles('1');

    expect(articles).toHaveLength(2);
  });

  it('returns articles only once', async (): Promise<void> => {
    const fetchArticle: FetchArticle = async (doi) => ({
      doi,
      title: `Title of ${doi.value}`,
    });
    const getReviewedArticles = createAdapter(
      reviewReferenceRepository.findReviewsForEditorialCommunityId,
      fetchArticle,
    );
    const articles = await getReviewedArticles('2');

    expect(articles).toHaveLength(1);
  });
});
