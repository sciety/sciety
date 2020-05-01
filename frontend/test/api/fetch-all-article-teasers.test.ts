import {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchAllArticleTeasers from '../../src/api/fetch-all-article-teasers';
import { FetchDataset } from '../../src/api/fetch-dataset';

describe('fetch-all-article-teasers', (): void => {
  it('returns the teasers', async () => {
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
    const fetchAllArticleTeasers = createFetchAllArticleTeasers(fetchDataset);
    const teasers = await fetchAllArticleTeasers();
    expect(teasers.length).toBe(2);
    expect(teasers[0].title).toStrictEqual('Article title');
    expect(teasers[0].authors).toContain('Josiah S. Carberry');
    expect(teasers[0].authors).toContain('Albert Einstein');
  });
});
