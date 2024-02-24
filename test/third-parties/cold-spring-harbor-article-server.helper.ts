import { ColdSpringHarborServer } from '../../src/third-parties/cold-spring-harbor-server.js';
import { arbitraryNumber } from '../helpers.js';

export const arbitraryColdSpringHarborArticleServer = (): ColdSpringHarborServer => {
  const articleServers: ReadonlyArray<ColdSpringHarborServer> = [
    'biorxiv',
    'medrxiv',
  ];
  return articleServers[arbitraryNumber(0, articleServers.length - 1)];
};
