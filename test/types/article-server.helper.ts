import { ArticleServer } from '../../src/types/article-server.js';
import { arbitraryNumber } from '../helpers.js';

export const arbitraryArticleServer = (): ArticleServer => {
  const articleServers: ReadonlyArray<ArticleServer> = [
    'biorxiv',
    'medrxiv',
    'researchsquare',
    'scielopreprints',
    'osf',
  ];
  return articleServers[arbitraryNumber(0, articleServers.length - 1)];
};
