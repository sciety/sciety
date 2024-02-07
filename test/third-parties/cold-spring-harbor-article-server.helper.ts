import { ColdSpringHarborServer } from '../../src/third-parties/cold-spring-harbor-server';
import { arbitraryNumber } from '../helpers';

export const arbitraryColdSpringHarborArticleServer = (): ColdSpringHarborServer => {
  const articleServers: ReadonlyArray<ColdSpringHarborServer> = [
    'biorxiv',
    'medrxiv',
  ];
  return articleServers[arbitraryNumber(0, articleServers.length - 1)];
};
