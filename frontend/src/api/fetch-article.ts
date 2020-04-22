import article1 from '../data/article1';
import article2 from '../data/article2';
import { ReviewedArticle } from '../types/reviewed-article';

export type FetchArticle = (doi: string) => ReviewedArticle;

export default (doi: string): ReviewedArticle => {
  const allArticles = [
    article1,
    article2,
  ];
  const matches = allArticles.filter((reviewedArticle) => reviewedArticle.article.doi === doi);
  if (matches.length !== 1) {
    throw new Error(`Article DOI ${doi} not found`);
  }
  return matches[0];
};
