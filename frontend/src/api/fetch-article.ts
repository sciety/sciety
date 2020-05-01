import { namedNode } from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import Doi from '../data/doi';
import { Article } from '../types/article';

export type FetchArticle = (doi: Doi) => Promise<Article>;

export default (fetchDataset: FetchDataset): FetchArticle => (
  async (doi: Doi): Promise<Article> => {
    const articleIri = namedNode(`https://doi.org/${doi}`);
    const graph = await fetchDataset(articleIri);

    const title = graph.out(dcterms.title).value || 'Unknown article';
    const authors = graph.out(dcterms.creator).map((author) => author.out(foaf.name).value || 'Unknown author');
    const publicationDate = new Date(graph.out(dcterms.date).value || 0);
    const abstract = '<p>No abstract available.</p>';

    return {
      doi,
      title,
      authors,
      publicationDate,
      abstract,
    };
  }
);
