import { namedNode } from '@rdfjs/data-model';
import { dcterms } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import { FetchReview } from './fetch-review';
import article3 from '../data/article3';
import article4 from '../data/article4';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';
import { ReviewedArticle } from '../types/reviewed-article';

export type FetchReviewedArticle = (doi: Doi) => Promise<ReviewedArticle>;

export default (
  fetchDataset: FetchDataset,
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchReview: FetchReview,
):
FetchReviewedArticle => (
  async (doi: Doi): Promise<ReviewedArticle> => {
    const articleReviews = reviewReferenceRepository.findReviewDoisForArticleDoi(doi);

    if (articleReviews.length === 0) {
      throw new Error(`Article DOI ${doi} not found`);
    }

    const allArticles = [
      article3,
      article4,
    ];

    const [matched] = allArticles.filter((reviewedArticle) => reviewedArticle.article.doi.value === doi.value);

    const articleIri = namedNode(`https://doi.org/${doi}`);
    const graph = await fetchDataset(articleIri);

    const title = graph.out(dcterms.title).value || 'Unknown article';
    const publicationDate = new Date(graph.out(dcterms.date).value || 0);

    return {
      article: {
        ...matched.article,
        title,
        publicationDate,
      },
      reviews: await Promise.all(articleReviews.map(fetchReview)),
    };
  }
);
