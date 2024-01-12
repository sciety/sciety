import { arbitraryNumber } from '../../helpers';
import { ColdSpringHarborServer } from '../../../src/third-parties/biorxiv/cold-spring-harbor-server';

export const arbitraryColdSpringHarborServer = (): ColdSpringHarborServer => {
  const articleServers: ReadonlyArray<ColdSpringHarborServer> = [
    'biorxiv',
    'medrxiv',
  ];
  return articleServers[arbitraryNumber(0, articleServers.length - 1)];
};
