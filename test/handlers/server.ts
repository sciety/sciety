import { Server } from 'http';
import { literal, namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchArticle from '../../src/api/fetch-article';
import createFetchCommunityArticles from '../../src/api/fetch-community-articles';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import { article3, article4 } from '../../src/data/article-dois';
import { article3Review1, article4Review1 } from '../../src/data/review-dois';
import createReviewReferenceRepository from '../../src/data/review-references';
import createRouter, { RouterServices } from '../../src/router';
import createServer from '../../src/server';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';

export interface TestServer {
  server: Server;
  reviewReferenceRepository: ReviewReferenceRepository;
}

export default (): TestServer => {
  const reviewReferenceRepository = createReviewReferenceRepository();
  reviewReferenceRepository.add(article3, article3Review1);
  reviewReferenceRepository.add(article4, article4Review1);
  const fetchCrossrefDataset: FetchDataset = async () => (
    clownface({ dataset: datasetFactory(), term: namedNode('http://example.com/some-crossref-node') })
      .addOut(dcterms.title, 'Article title')
  );
  const fetchDataCiteDataset: FetchDataset = async () => (
    clownface({ dataset: datasetFactory(), term: namedNode('http://example.com/some-datacite-node') })
      .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
      .addOut(schema.description, 'A summary')
      .addOut(schema.author, (author) => author.addOut(schema.name, 'Author name'))
  );
  const fetchArticle = createFetchArticle(fetchCrossrefDataset);
  const fetchCommunityArticles = createFetchCommunityArticles();
  const fetchReview = createFetchReview(fetchDataCiteDataset);
  const fetchReviewedArticle = createFetchReviewedArticle(
    reviewReferenceRepository,
    fetchArticle,
    fetchReview,
  );
  const services: RouterServices = {
    fetchCommunityArticles,
    fetchReviewedArticle,
    reviewReferenceRepository,
  };

  const router = createRouter(services);
  return {
    server: createServer(router),
    reviewReferenceRepository,
  };
};
