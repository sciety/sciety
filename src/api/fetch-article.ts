import { namedNode } from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import axios from 'axios';
import { DOMParser } from 'xmldom';
import { FetchDataset } from './fetch-dataset';
import abstracts from '../data/abstracts';
import Doi from '../data/doi';
import createLogger from '../logger';
import { FetchedArticle } from '../types/fetched-article';

export type FetchArticle = (doi: Doi) => Promise<FetchedArticle>;

export type FetchAbstract = (doi: Doi) => Promise<string>;

export const fetchAbstractFromCrossref: FetchAbstract = async (doi) => {
  const log = createLogger('api:fetch-abstract-from-crossref');

  const uri = `https://doi.org/${doi.value}`;
  log(`Fetching abstract for ${uri}`);

  const response = await axios.get(
    uri,
    { headers: { Accept: 'application/vnd.crossref.unixref+xml' } },
  );

  const doc = new DOMParser().parseFromString(response.data, 'text/xml');
  const abstractElement = doc.getElementsByTagName('abstract')[0];

  if (typeof abstractElement.textContent !== 'string') {
    log(`Did not find abstract for ${doi}`);

    return `No abstract for ${doi} available`;
  }

  const abstract = abstractElement.textContent;

  log(`Found abstract for ${doi}: ${abstract}`);

  return abstract;
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
