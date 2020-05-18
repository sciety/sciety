import { Server } from 'http';
import { literal, namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchArticle from '../../src/api/fetch-article';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchReview from '../../src/api/fetch-review';
import Doi from '../../src/data/doi';
import createEditorialCommunityRepository from '../../src/data/in-memory-editorial-communities';
import createReviewReferenceRepository from '../../src/data/in-memory-review-references';
import createRouter from '../../src/router';
import createServer from '../../src/server';
import { Adapters } from '../../src/types/adapters';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';

const articleA = new Doi('10.1101/833392');
const articleB = new Doi('10.1101/2020.03.22.002386');
const articleAReview1 = new Doi('10.5281/zenodo.3678325');
const articleBReview1 = new Doi('10.5281/zenodo.3756961');

export interface TestServer {
  server: Server;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
}

export default (): TestServer => {
  const editorialCommunities = createEditorialCommunityRepository();
  const reviewReferenceRepository = createReviewReferenceRepository();
  reviewReferenceRepository.add(articleA, articleAReview1, editorialCommunities.all()[0].id);
  reviewReferenceRepository.add(articleB, articleBReview1, editorialCommunities.all()[1].id);
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
  const fetchReview = createFetchReview(fetchDataCiteDataset);
  const adapters: Adapters = {
    fetchArticle,
    fetchReview,
    editorialCommunities,
    reviewReferenceRepository,
  };

  const router = createRouter(adapters);
  return {
    server: createServer(router),
    editorialCommunities,
    reviewReferenceRepository,
  };
};
