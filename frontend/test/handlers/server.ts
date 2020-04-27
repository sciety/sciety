import { IncomingMessage, Server, ServerResponse } from 'http';
import { blankNode, quad, literal } from '@rdfjs/data-model';
import datasetFactory from 'rdf-dataset-indexed';
import handler from 'serve-handler';
import { schema } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import reviewReferenceRepository from '../../src/data/review-references';
import createRouter, { RouterServices } from '../../src/router';
import createServer from '../../src/server';

const fetchDataset: FetchDataset = async (iri) => {
  const authorIri = blankNode();

  return datasetFactory([
    quad(iri, schema.datePublished, literal('2020-02-20')),
    quad(iri, schema.description, literal('A summary')),
    quad(iri, schema.author, authorIri),
    quad(authorIri, schema.name, literal('Author name')),
  ]);
};

export default (): Server => {
  const fetchReview = createFetchReview(fetchDataset);
  const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, fetchReview);
  const services: RouterServices = { fetchReviewedArticle, reviewReferenceRepository };

  const defaultRoute = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    await handler(request, response, { public: 'static' });
  };
  const router = createRouter(defaultRoute, services);
  return createServer(router);
};
