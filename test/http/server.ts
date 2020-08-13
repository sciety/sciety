import { Server } from 'http';
import { literal, namedNode } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import { Result } from 'true-myth';
import bootstrapEditorialCommunities from '../../src/data/bootstrap-editorial-communities';
import createRouter from '../../src/http/router';
import createServer from '../../src/http/server';
import { Adapters } from '../../src/infrastructure/adapters';
import { FetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import createFetchDataciteReview from '../../src/infrastructure/fetch-datacite-review';
import { FetchDataset } from '../../src/infrastructure/fetch-dataset';
import createFetchHypothesisAnnotation from '../../src/infrastructure/fetch-hypothesis-annotation';
import createFetchReview from '../../src/infrastructure/fetch-review';
import createGetBiorxivCommentCount from '../../src/infrastructure/get-biorxiv-comment-count';
import createGetDisqusPostCount from '../../src/infrastructure/get-disqus-post-count';
import createEditorialCommunityRepository from '../../src/infrastructure/in-memory-editorial-communities';
import createEndorsementsRepository from '../../src/infrastructure/in-memory-endorsements-repository';
import createReviewReferenceRepository from '../../src/infrastructure/in-memory-review-references';
import Doi from '../../src/types/doi';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';
import dummyLogger from '../dummy-logger';
import shouldNotBeCalled from '../should-not-be-called';

const articleA = new Doi('10.1101/833392');
const articleB = new Doi('10.1101/2020.03.22.002386');
const articleAReview1 = new Doi('10.5281/zenodo.3678325');
const articleBReview1 = new Doi('10.5281/zenodo.3756961');

interface TestServer {
  adapters: Adapters,
  server: Server;
  editorialCommunities: EditorialCommunityRepository;
  reviewReferenceRepository: ReviewReferenceRepository;
}

export default async (): Promise<TestServer> => {
  const editorialCommunities = createEditorialCommunityRepository(dummyLogger);
  for (const editorialCommunity of bootstrapEditorialCommunities) {
    void editorialCommunities.add(editorialCommunity);
  }
  const reviewReferenceRepository = createReviewReferenceRepository([
    {
      type: 'ArticleReviewed',
      date: new Date('2020-05-19T14:00:00Z'),
      actorId: editorialCommunities.all()[0].id,
      articleId: articleA,
      reviewId: articleAReview1,
    },
    {
      type: 'ArticleReviewed',
      date: new Date('2020-05-19T14:00:00Z'),
      actorId: editorialCommunities.all()[1].id,
      articleId: articleB,
      reviewId: articleBReview1,
    },
  ]);
  const fetchDataCiteDataset: FetchDataset = async () => (
    clownface({ dataset: datasetFactory(), term: namedNode('http://example.com/some-datacite-node') })
      .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
      .addOut(schema.description, 'A summary')
      .addOut(schema.author, (author) => author.addOut(schema.name, 'Author name'))
  );
  const fetchArticle: FetchCrossrefArticle = async (doi) => (Result.ok({
    abstract: 'Article abstract.',
    authors: [],
    doi,
    title: 'Article title',
    publicationDate: new Date(),
  }));
  const getDisqusPostCount = createGetDisqusPostCount(async () => ({ response: [{ posts: 0 }] }), dummyLogger);
  const getBiorxivCommentCount = createGetBiorxivCommentCount(getDisqusPostCount, dummyLogger);
  const fetchReview = createFetchReview(
    createFetchDataciteReview(fetchDataCiteDataset, dummyLogger),
    createFetchHypothesisAnnotation(shouldNotBeCalled, dummyLogger),
  );

  const adapters: Adapters = {
    fetchArticle,
    getBiorxivCommentCount,
    fetchReview,
    fetchStaticFile: async (filename: string) => `Contents of ${filename}`,
    searchEuropePmc: async () => ({ items: [], total: 0 }),
    editorialCommunities,
    endorsements: createEndorsementsRepository([]),
    reviewReferenceRepository,
    filterEvents: async () => [],
    logger: dummyLogger,
  };

  const router = createRouter(adapters);
  return {
    adapters,
    server: createServer(router, dummyLogger),
    editorialCommunities,
    reviewReferenceRepository,
  };
};
