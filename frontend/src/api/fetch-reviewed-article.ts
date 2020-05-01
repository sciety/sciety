import { namedNode } from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import { FetchReview } from './fetch-review';
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

    const articleIri = namedNode(`https://doi.org/${doi}`);
    const graph = await fetchDataset(articleIri);

    const title = graph.out(dcterms.title).value || 'Unknown article';
    const authors = graph.out(dcterms.creator).map((author) => author.out(foaf.name).value || 'Unknown author');
    const publicationDate = new Date(graph.out(dcterms.date).value || 0);
    const abstract = '<p>No abstract available.</p>';

    return {
      article: {
        doi,
        title,
        authors,
        publicationDate,
        abstract,
      },
      reviews: await Promise.all(articleReviews.map(fetchReview)),
    };
  }
);
