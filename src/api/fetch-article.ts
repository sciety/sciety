import { namedNode } from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import abstracts from '../data/abstracts';
import Doi from '../data/doi';
import createLogger from '../logger';
import { FetchedArticle } from '../types/fetched-article';

export type FetchArticle = (doi: Doi) => Promise<FetchedArticle>;

export default (fetchDataset: FetchDataset): FetchArticle => {
  const log = createLogger('api:fetch-article');
  return async (doi: Doi): Promise<FetchedArticle> => {
    const articleIri = namedNode(`https://doi.org/${doi}`);
    log(`Fetching article ${articleIri.value}`);
    const graph = await fetchDataset(articleIri);

    const title = graph.out(dcterms.title).value || 'Unknown article';
    const authors = graph.out(dcterms.creator).map((author) => author.out(foaf.name).value || 'Unknown author');
    const publicationDate = new Date(graph.out(dcterms.date).value || 0);
    const abstract = abstracts[doi.value] || 'No abstract available.';

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
