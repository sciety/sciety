import { namedNode, quad, literal } from '@rdfjs/data-model';
import { dcterms } from '@tpluscode/rdf-ns-builders';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchAllArticleTeasers from '../../src/api/fetch-all-article-teasers';
import { FetchDataset } from '../../src/api/fetch-dataset';

describe('fetch-all-article-teasers', (): void => {
  it('returns the teasers', async () => {
    const fetchDataset: FetchDataset = async (iri) => {
      const normalisedIri = namedNode(iri.value.replace(/^https:\/\/doi\.org\//, 'http://dx.doi.org/'));
      return datasetFactory([
        quad(normalisedIri, dcterms.title, literal('Article title')),
      ]);
    };
    const fetchAllArticleTeasers = createFetchAllArticleTeasers(fetchDataset);
    const teasers = await fetchAllArticleTeasers();
    expect(teasers.length).toBe(2);
    expect(teasers[0].title).toStrictEqual('Article title');
  });
});
