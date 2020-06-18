import { literal } from '@rdfjs/data-model';
import { dcterms, xsd } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchArticle, { FetchCrossrefArticle } from '../../src/api/fetch-article';
import { FetchDataset } from '../../src/api/fetch-dataset';
import Doi from '../../src/data/doi';

const doi = new Doi('10.5555/12345678');

describe('fetch-article', (): void => {
  it('returns the article', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
        .addOut(dcterms.date, literal('2020-02-20', xsd.date))
    );
    const fetchCrossrefArticle: FetchCrossrefArticle = async () => ({
      abstract: 'Article abstract.',
      authors: [],
      title: '',
      publicationDate: new Date(),
    });
    const fetchArticle = createFetchArticle(fetchDataset, fetchCrossrefArticle);
    const article = await fetchArticle(doi);

    expect(article.doi).toBe(doi);
    expect(article.publicationDate).toStrictEqual(new Date('2020-02-20'));
  });

  it('returns the title', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
    );
    const fetchCrossrefArticle: FetchCrossrefArticle = async () => ({
      abstract: '',
      authors: [],
      title: 'Article title',
      publicationDate: new Date(),
    });
    const fetchArticle = createFetchArticle(fetchDataset, fetchCrossrefArticle);
    const article = await fetchArticle(doi);

    expect(article.title).toBe('Article title');
  });

  it('returns the abstract', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
    );
    const fetchCrossrefArticle: FetchCrossrefArticle = async () => ({
      abstract: 'Article abstract.',
      authors: [],
      title: '',
      publicationDate: new Date(),
    });
    const fetchArticle = createFetchArticle(fetchDataset, fetchCrossrefArticle);
    const article = await fetchArticle(doi);

    expect(article.abstract).toBe('Article abstract.');
  });

  it('returns the authors', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
    );
    const fetchCrossrefArticle: FetchCrossrefArticle = async () => ({
      abstract: 'Article abstract.',
      authors: ['Eesha Ross', 'Fergus Fountain'],
      title: '',
      publicationDate: new Date(),
    });
    const fetchArticle = createFetchArticle(fetchDataset, fetchCrossrefArticle);
    const article = await fetchArticle(doi);

    expect(article.authors).toStrictEqual(['Eesha Ross', 'Fergus Fountain']);
  });
});
