import { namedNode } from '@rdfjs/data-model';
import { FetchDataset } from './fetch-dataset';
import article3 from '../data/article3';
import article4 from '../data/article4';
import createLogger from '../logger';
import { ArticleTeaser } from '../types/article-teaser';

export type FetchAllArticleTeasers = () => Promise<Array<ArticleTeaser>>;

export default (fetchDataset: FetchDataset): FetchAllArticleTeasers => {
  const log = createLogger('api:fetch-all-article-teasers');

  return async (): Promise<Array<ArticleTeaser>> => Promise.all([
    article3,
    article4,
  ].map(async ({ article, reviews }) => {
    const articleIri = namedNode(`https://doi.org/${article.doi}`);
    const dataset = await fetchDataset(articleIri);

    log(`${articleIri.value} has ${dataset.size} quads`);

    return {
      category: article.category,
      title: article.title,
      authors: article.authors,
      numberOfReviews: reviews.length,
      link: `/articles/${encodeURIComponent(article.doi)}`,
    };
  }));
};
