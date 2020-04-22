import article1 from '../data/article1';
import article2 from '../data/article2';
import { Article } from '../types/article';

export default (doi: string): Article | undefined => {
  const allArticles = [
    article1,
    article2,
  ];
  const matches = allArticles.filter((article) => article.doi === doi);
  if (matches.length !== 1) {
    return undefined;
  }
  return matches[0];
};
