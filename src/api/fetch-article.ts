import { namedNode } from '@rdfjs/data-model';
import { dcterms } from '@tpluscode/rdf-ns-builders';
import { DOMParser } from 'xmldom';
import { FetchDataset } from './fetch-dataset';
import Doi from '../data/doi';
import createLogger from '../logger';
import { FetchedArticle } from '../types/fetched-article';

export type FetchArticle = (doi: Doi) => Promise<FetchedArticle>;

export type FetchCrossrefArticle = (doi: Doi) => Promise<{
  abstract: string;
  authors: Array<string>;
}>;

export type MakeHttpRequest = (uri: string, acceptHeader: string) => Promise<string>;

export const createFetchCrossrefArticle = (makeHttpRequest: MakeHttpRequest): FetchCrossrefArticle => {
  const log = createLogger('api:fetch-crossref-article');

  const getElement = (ancestor: Document | Element, qualifiedName: string): Element | null => (
    ancestor.getElementsByTagName(qualifiedName).item(0)
  );

  const getAbstract = (doc: Document, doi: Doi): string => {
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
      .replace(/<abstract[^>]*>/, '')
      .replace(/<\/abstract>/, '')
      .replace(/<italic[^>]*>/g, '<i>')
      .replace(/<\/italic>/g, '</i>')
      .replace(/<list[^>]* list-type=['"]bullet['"][^>]*/g, '<ul')
      .replace(/<\/list>/g, '</ul>')
      .replace(/<list-item[^>]*/g, '<li')
      .replace(/<\/list-item>/g, '</li>')
      .replace(/<sec[^>]*/g, '<section')
      .replace(/<\/sec>/g, '</section>')
      .replace(/<title[^>]*/g, '<h3 class="ui header"')
      .replace(/<\/title>/g, '</h3>');
  };

  const getAuthors = (doc: Document, doi: Doi): Array<string> => {
    const contributorsElement = getElement(doc, 'contributors');

    if (!contributorsElement || typeof contributorsElement?.textContent !== 'string') {
      log(`Did not find contributors for ${doi}`);
      return [];
    }

    return Array.from(contributorsElement.getElementsByTagName('person_name'))
      .map((person) => {
        const givenName = person.getElementsByTagName('given_name')[0].textContent;
        const surname = person.getElementsByTagName('surname')[0].textContent;

        return `${givenName} ${surname}`;
      });
  };

  return async (doi) => {
    const uri = `https://doi.org/${doi.value}`;
    log(`Fetching Crossref article for ${uri}`);

    const response = await makeHttpRequest(uri, 'application/vnd.crossref.unixref+xml');

    const doc = new DOMParser().parseFromString(response, 'text/xml');

    return {
      abstract: getAbstract(doc, doi),
      authors: getAuthors(doc, doi),
    };
  };
};

export default (fetchDataset: FetchDataset, fetchCrossrefArticle: FetchCrossrefArticle): FetchArticle => {
  const log = createLogger('api:fetch-article');
  return async (doi: Doi): Promise<FetchedArticle> => {
    const articleIri = namedNode(`https://doi.org/${doi}`);
    log(`Fetching article ${articleIri.value}`);
    const graph = await fetchDataset(articleIri);

    const title = graph.out(dcterms.title).value ?? 'Unknown article';
    const publicationDate = new Date(graph.out(dcterms.date).value ?? 0);
    const crossrefArticle = await fetchCrossrefArticle(doi);

    const response: FetchedArticle = {
      doi,
      title,
      authors: crossrefArticle.authors,
      publicationDate,
      abstract: crossrefArticle.abstract,
    };
    log(`Retrieved article: ${JSON.stringify(response)}`);
    return response;
  };
};
