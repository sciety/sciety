import { namedNode } from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import { article3, article4 } from '../data/article-dois';
import { ArticleTeaser } from '../types/article-teaser';
import ReviewReferenceRepository from '../types/review-reference-repository';

export type FetchAllArticleTeasers = () => Promise<Array<ArticleTeaser>>;

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchDataset: FetchDataset,
): FetchAllArticleTeasers => (
  async (): Promise<Array<ArticleTeaser>> => Promise.all([
    article3,
    article4,
  ].map(async (doi) => {
    const graph = await fetchDataset(namedNode(`https://doi.org/${doi}`));

    const title = graph.out(dcterms.title).value || 'Unknown article';
    const authors = graph.out(dcterms.creator).map((author) => author.out(foaf.name).value || 'Unknown author');

    return {
      doi,
      title,
      authors,
      numberOfReviews: reviewReferenceRepository.findReviewDoisForArticleDoi(doi).length,
      link: `/articles/${doi}`,
    };
  }))
);
