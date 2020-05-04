import { blankNode, literal, quad } from '@rdfjs/data-model';
import { dcterms, foaf, xsd } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchArticle from '../../src/api/fetch-article';
import { FetchDataset } from '../../src/api/fetch-dataset';
import Doi from '../../src/data/doi';

const doi = new Doi('10.5555/12345678');

describe('fetch-article', (): void => {
  it('returns the article', async () => {
    const fetchDataset: FetchDataset = async (iri) => {
      const firstAuthorIri = blankNode();
      const secondAuthorIri = blankNode();

      return clownface({
        dataset: datasetFactory([
          quad(iri, dcterms.title, literal('Article title')),
          quad(iri, dcterms.date, literal('2020-02-20', xsd.date)),
          quad(iri, dcterms.creator, firstAuthorIri),
          quad(firstAuthorIri, foaf.name, literal('Josiah S. Carberry')),
          quad(iri, dcterms.creator, secondAuthorIri),
          quad(secondAuthorIri, foaf.name, literal('Albert Einstein')),
        ]),
        term: iri,
      });
    };
    const fetchArticle = createFetchArticle(fetchDataset);
    const article = await fetchArticle(doi);

    expect(article.doi).toBe(doi);
    expect(article.title).toBe('Article title');
    expect(article.publicationDate).toStrictEqual(new Date('2020-02-20'));
    expect(article.authors).toContain('Josiah S. Carberry');
    expect(article.authors).toContain('Albert Einstein');
  });
});
