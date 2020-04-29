import { Server } from 'http';
import {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchAllArticleTeasers from '../../src/api/fetch-all-article-teasers';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import { article3, article4 } from '../../src/data/article-dois';
import { article3Review1, article4Review1 } from '../../src/data/review-dois';
import createReviewReferenceRepository from '../../src/data/review-references';
import createRouter, { RouterServices } from '../../src/router';
import createServer from '../../src/server';

export default (): Server => {
  const fetchCrossrefDataset: FetchDataset = async () => {
    const usedIri = namedNode('http://example.com/some-crossref-node');

    return clownface({
      dataset: datasetFactory([
        quad(usedIri, dcterms.title, literal('Article title')),
      ]),
      term: usedIri,
    });
  };
  const fetchDataCiteDataset: FetchDataset = async (iri) => {
    const usedIri = namedNode('http://example.com/some-datacite-node');
    const authorIri = blankNode();

    return clownface({
      dataset: datasetFactory([
        quad(usedIri, schema.datePublished, literal('2020-02-20')),
        quad(usedIri, schema.description, literal('A summary')),
        quad(usedIri, schema.author, authorIri),
        quad(authorIri, schema.name, literal('Author name')),
      ]),
      term: iri,
    });
  };
  const fetchAllArticleTeasers = createFetchAllArticleTeasers(fetchCrossrefDataset);
  const fetchReview = createFetchReview(fetchDataCiteDataset);
  const reviewReferenceRepository = createReviewReferenceRepository();
  reviewReferenceRepository.add({
    articleDoi: article3,
    reviewDoi: article3Review1,
  });
  reviewReferenceRepository.add({
    articleDoi: article4,
    reviewDoi: article4Review1,
  });
  const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, fetchReview);
  const services: RouterServices = { fetchAllArticleTeasers, fetchReviewedArticle, reviewReferenceRepository };

  const router = createRouter(services);
  return createServer(router);
};
