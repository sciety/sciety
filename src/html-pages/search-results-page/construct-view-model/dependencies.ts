import { Ports as FetchExtraDetailsPorts } from './fetch-extra-details';
import { Ports as PerformAllSearchesPorts } from './perform-all-searches';

export type Dependencies = PerformAllSearchesPorts
// The next two lines are necessary as getLatestVersionDate is not in CollectedPorts and is constructed locally
& Omit<FetchExtraDetailsPorts, 'getLatestArticleVersionDate'>;
