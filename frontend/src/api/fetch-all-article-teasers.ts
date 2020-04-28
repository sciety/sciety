import { namedNode } from '@rdfjs/data-model';
import { dcterms } from '@tpluscode/rdf-ns-builders';
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
    const dataset = await fetchDataset(namedNode(`https://doi.org/${article.doi}`));

    const articleIri = namedNode(`http://dx.doi.org/${article.doi}`);

    const [title] = dataset.match(articleIri, dcterms.title);

    return {
      category: article.category,
      title: title.object.value,
      authors: article.authors,
      numberOfReviews: reviews.length,
      link: `/articles/${encodeURIComponent(article.doi)}`,
    };
  }))
);
