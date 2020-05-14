import { Server } from 'http';
import { literal, namedNode } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchArticle from '../../src/api/fetch-article';
import { FetchDataset } from '../../src/api/fetch-dataset';
import createFetchEditorialCommunityReviewedArticles from '../../src/api/fetch-editorial-community-reviewed-articles';
import createFetchReview from '../../src/api/fetch-review';
import { article3, article4 } from '../../src/data/article-dois';
import createEditorialCommunityRepository from '../../src/data/in-memory-editorial-communities';
import createReviewReferenceRepository from '../../src/data/in-memory-review-references';
import { article3Review1, article4Review1 } from '../../src/data/review-dois';
import createRouter from '../../src/router';
import createServer from '../../src/server';
import { Adapters } from '../../src/types/adapters';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';

export interface TestServer {
  server: Server;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
}

export default (): TestServer => {
  const editorialCommunities = createEditorialCommunityRepository();
  const reviewReferenceRepository = createReviewReferenceRepository();
  reviewReferenceRepository.add(article3, article3Review1, editorialCommunities.all()[0].id);
  reviewReferenceRepository.add(article4, article4Review1, editorialCommunities.all()[1].id);
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
  const fetchEditorialCommunityReviewedArticles = createFetchEditorialCommunityReviewedArticles(editorialCommunities);
  const fetchReview = createFetchReview(fetchDataCiteDataset);
  const adapters: Adapters = {
    fetchArticle,
    fetchEditorialCommunityReviewedArticles,
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
