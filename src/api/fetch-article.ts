import { namedNode } from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import { DOMParser } from 'xmldom';
import { FetchDataset } from './fetch-dataset';
import abstracts from '../data/abstracts';
import Doi from '../data/doi';
import createLogger from '../logger';
import { FetchedArticle } from '../types/fetched-article';

export type FetchArticle = (doi: Doi) => Promise<FetchedArticle>;

export type FetchAbstract = (doi: Doi) => Promise<string>;

export type MakeHttpRequest = (uri: string, acceptHeader: string) => Promise<string>;

export const createFetchAbstractFromCrossref = (makeHttpRequest: MakeHttpRequest): FetchAbstract => {
  const log = createLogger('api:fetch-abstract-from-crossref');
  const getElement = (ancestor: Document | Element, qualifiedName: string): Element | null => (
    ancestor.getElementsByTagName(qualifiedName).item(0)
  );
  return async (doi) => {
    const uri = `https://doi.org/${doi.value}`;
    log(`Fetching abstract for ${uri}`);

    const response = await makeHttpRequest(uri, 'application/vnd.crossref.unixref+xml');

    const doc = new DOMParser().parseFromString(response, 'text/xml');
    const abstractElement = getElement(doc, 'abstract');

    if (typeof abstractElement?.textContent !== 'string') {
      log(`Did not find abstract for ${doi}`);

      return `No abstract for ${doi} available`;
    }

    log(`Found abstract for ${doi}: ${abstractElement.textContent}`);

    const titleElement = getElement(abstractElement, 'title');
    if (titleElement) {
      abstractElement.removeChild(titleElement);
    }

    return `${abstractElement}`
      .replace('<abstract>', '')
      .replace('</abstract>', '')
      .replace(/<italic>/g, '<i>')
      .replace(/<\/italic>/g, '</i>')
      .replace(/<list list-type="bullet"/g, '<ul')
      .replace(/<\/list>/g, '</ul>')
      .replace(/<list-item/g, '<li')
      .replace(/<\/list-item>/g, '</li>')
      .replace(/<sec/g, '<section')
      .replace(/<\/sec>/g, '</section>')
      .replace(/<title/g, '<h3')
      .replace(/<\/title>/g, '</h3>');
  };
};

export default (fetchDataset: FetchDataset, fetchAbstract: FetchAbstract): FetchArticle => {
  const log = createLogger('api:fetch-article');
  return async (doi: Doi): Promise<FetchedArticle> => {
    const articleIri = namedNode(`https://doi.org/${doi}`);
    log(`Fetching article ${articleIri.value}`);
    const graph = await fetchDataset(articleIri);

    const title = graph.out(dcterms.title).value ?? 'Unknown article';
    const authors = graph.out(dcterms.creator).map((author) => author.out(foaf.name).value ?? 'Unknown author');
    const publicationDate = new Date(graph.out(dcterms.date).value ?? 0);
    const abstract = abstracts[doi.value] ?? await fetchAbstract(doi);

    const response: FetchedArticle = {
      doi,
      title,
      authors,
      publicationDate,
      abstract,
    };
    log(`Retrieved article: ${JSON.stringify(response)}`);
    return response;
  };
};
