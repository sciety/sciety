import { ColdSpringHarborServer } from '../../src/third-parties/biorxiv/cold-spring-harbor-server';
import { ArticleServer } from '../../src/types/article-server';
import { arbitraryNumber } from '../helpers';

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

export const arbitraryColdSpringHarborArticleServer = (): ColdSpringHarborServer => {
  const articleServers: ReadonlyArray<ColdSpringHarborServer> = [
    'biorxiv',
    'medrxiv',
  ];
  return articleServers[arbitraryNumber(0, articleServers.length - 1)];
};

export const arbitraryNonColdSpringHarborArticleServer = (): ArticleServer => {
  const articleServers: ReadonlyArray<ArticleServer> = [
    'researchsquare',
    'scielopreprints',
    'osf',
  ];
  return articleServers[arbitraryNumber(0, articleServers.length - 1)];
};
