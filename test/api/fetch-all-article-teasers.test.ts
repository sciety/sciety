import {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchAllArticleTeasers from '../../src/api/fetch-all-article-teasers';
import { FetchDataset } from '../../src/api/fetch-dataset';
import Doi from '../../src/data/doi';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';
import shouldNotBeCalled from '../should-not-be-called';

describe('fetch-all-article-teasers', (): void => {
  it('returns the teasers', async () => {
    const reviewReferenceRepository: ReviewReferenceRepository = {
      add: shouldNotBeCalled,
      findReviewDoisForArticleDoi: () => [new Doi('10.5555/987654321')],
    };
    const fetchDataset: FetchDataset = async (iri) => {
      const normalisedIri = namedNode(iri.value.replace(/^https:\/\/doi\.org\//, 'http://dx.doi.org/'));
      const firstAuthorIri = blankNode();
      const secondAuthorIri = blankNode();
      return clownface({
        dataset: datasetFactory([
          quad(normalisedIri, dcterms.title, literal('Article title')),
          quad(normalisedIri, dcterms.creator, firstAuthorIri),
          quad(firstAuthorIri, foaf.name, literal('Josiah S. Carberry')),
          quad(normalisedIri, dcterms.creator, secondAuthorIri),
          quad(secondAuthorIri, foaf.name, literal('Albert Einstein')),
        ]),
        term: normalisedIri,
      });
    };
    const fetchAllArticleTeasers = createFetchAllArticleTeasers(reviewReferenceRepository, fetchDataset);
    const teasers = await fetchAllArticleTeasers();
    expect(teasers.length).toBe(2);
    expect(teasers[0].title).toStrictEqual('Article title');
    expect(teasers[0].authors).toContain('Josiah S. Carberry');
    expect(teasers[0].authors).toContain('Albert Einstein');
  });
});
