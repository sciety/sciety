import { literal } from '@rdfjs/data-model';
import { dcterms, foaf, xsd } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchArticle, { FetchAbstract } from '../../src/api/fetch-article';
import { FetchDataset } from '../../src/api/fetch-dataset';
import Doi from '../../src/data/doi';

const doi = new Doi('10.5555/12345678');

describe('fetch-article', (): void => {
  it('returns the article', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
        .addOut(dcterms.title, 'Article title')
        .addOut(dcterms.date, literal('2020-02-20', xsd.date))
        .addOut(dcterms.creator, (author) => author.addOut(foaf.name, 'Josiah S. Carberry'))
        .addOut(dcterms.creator, (author) => author.addOut(foaf.name, 'Albert Einstein'))
    );
    const fetchAbstract: FetchAbstract = async () => ({ abstract: 'Article abstract.' });
    const fetchArticle = createFetchArticle(fetchDataset, fetchAbstract);
    const article = await fetchArticle(doi);

    expect(article.doi).toBe(doi);
    expect(article.title).toBe('Article title');
    expect(article.publicationDate).toStrictEqual(new Date('2020-02-20'));
    expect(article.authors).toContain('Josiah S. Carberry');
    expect(article.authors).toContain('Albert Einstein');
  });

  it('returns the abstract', async () => {
    const fetchDataset: FetchDataset = async (iri) => (
      clownface({ dataset: datasetFactory(), term: iri })
    );
    const fetchAbstract: FetchAbstract = async () => ({ abstract: 'Article abstract.' });
    const fetchArticle = createFetchArticle(fetchDataset, fetchAbstract);
    const article = await fetchArticle(doi);

    expect(article.abstract).toBe('Article abstract.');
  });
});
