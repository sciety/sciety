import Doi from '../../src/data/doi';
import createReviewReferenceRepository from '../../src/data/in-memory-review-references';
import createAdapter, { FetchArticle } from '../../src/editorial-community-page/get-reviewed-articles-from-review-reference-repository';

const articleA = new Doi('10.1111/1111');
const articleAReview1 = new Doi('10.5281/zenodo.222222');
const articleAReview2 = new Doi('10.5281/zenodo.444444');
const articleB = new Doi('10.2222/2222');
const articleBReview1 = new Doi('10.5281/zenodo.333333');
const articleC = new Doi('10.3333/3333');
const articleCReview1 = new Doi('10.5281/zenodo.666666');

const reviewReferenceRepository = createReviewReferenceRepository();
reviewReferenceRepository.add(articleA, articleAReview1, '1', new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(articleA, articleAReview2, '2', new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(articleB, articleBReview1, '1', new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(articleC, articleCReview1, '3', new Date('2020-05-19T14:00:00Z'));

describe('get-reviewed-articles-from-review-reference-repository', (): void => {
  it('returns only the articles reviewed by the requested editorial community', async (): Promise<void> => {
    const fetchArticle: FetchArticle = async (doi) => ({
      doi,
      title: `Title of ${doi.value}`,
    });
    const getReviewedArticles = createAdapter(reviewReferenceRepository, fetchArticle);
    const articles = await getReviewedArticles('1');

    expect(articles).toHaveLength(2);
  });
});
