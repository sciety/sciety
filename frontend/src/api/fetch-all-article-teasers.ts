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
    const dataset = await fetchDataset(namedNode(`https://doi.org/${article.doi}`));

    const articleIri = namedNode(`http://dx.doi.org/${article.doi}`);

    const [title] = dataset.match(articleIri, dcterms.title);
    const [...authorQuads] = dataset.match(articleIri, dcterms.creator);
    const authors = authorQuads.map(({ object }) => {
      const [author] = dataset.match(object, foaf.name);
      return author.object.value;
    });

    return {
      category: article.category,
      title: title.object.value,
      authors,
      numberOfReviews: reviews.length,
      link: `/articles/${article.doi}`,
    };
  }))
);
