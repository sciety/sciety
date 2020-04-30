import { namedNode } from '@rdfjs/data-model';
import { dcterms, foaf } from '@tpluscode/rdf-ns-builders';
import { FetchDataset } from './fetch-dataset';
import article3 from '../data/article3';
import article4 from '../data/article4';
import { ArticleTeaser } from '../types/article-teaser';

export type FetchAllArticleTeasers = () => Promise<Array<ArticleTeaser>>;

export default (fetchDataset: FetchDataset): FetchAllArticleTeasers => (
  async (): Promise<Array<ArticleTeaser>> => Promise.all([
    article3,
    article4,
  ].map(async ({ article, reviews }) => {
    const graph = await fetchDataset(namedNode(`https://doi.org/${article.doi}`));

    const title = graph.out(dcterms.title).value || 'Unknown article';
    const authors = graph.out(dcterms.creator).map((author) => author.out(foaf.name).value || 'Unknown author');

    return {
      title,
      authors,
      numberOfReviews: reviews.length,
      link: `/articles/${article.doi}`,
    };
  }))
);
