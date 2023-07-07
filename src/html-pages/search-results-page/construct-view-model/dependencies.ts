import { FetchStaticFile, SearchForArticles } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';
import { Ports as FetchExtraDetailsPorts } from './fetch-extra-details';

export type Dependencies = Queries
// The next two lines are necessary as getLatestVersionDate is not in CollectedPorts and is constructed locally
& Omit<FetchExtraDetailsPorts, 'getLatestArticleVersionDate'> & {
  fetchStaticFile: FetchStaticFile,
  searchForArticles: SearchForArticles,
};
