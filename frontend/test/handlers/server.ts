import { Server } from 'http';
import {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchAllArticleTeasers from '../../src/api/fetch-all-article-teasers';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import createReviewReferenceRepository from '../../src/data/review-references';
import createRouter, { RouterServices } from '../../src/router';
import createServer from '../../src/server';

export default (): Server => {
  const fetchCrossrefDataset: FetchDataset = async (iri) => {
    const normalisedIri = namedNode(iri.value.replace(/^https:\/\/doi\.org\//, 'http://dx.doi.org/'));

    return datasetFactory([
      quad(normalisedIri, dcterms.title, literal('Article title')),
    ]);
  };
  const fetchDataCiteDataset: FetchDataset = async (iri) => {
    const authorIri = blankNode();

    return datasetFactory([
      quad(iri, schema.datePublished, literal('2020-02-20')),
      quad(iri, schema.description, literal('A summary')),
      quad(iri, schema.author, authorIri),
      quad(authorIri, schema.name, literal('Author name')),
    ]);
  };
  const fetchAllArticleTeasers = createFetchAllArticleTeasers(fetchCrossrefDataset);
  const fetchReview = createFetchReview(fetchDataCiteDataset);
  const reviewReferenceRepository = createReviewReferenceRepository();
  const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, fetchReview);
  const services: RouterServices = { fetchAllArticleTeasers, fetchReviewedArticle, reviewReferenceRepository };

  const router = createRouter(services);
  return createServer(router);
};
