import { Logger } from '../logger';
import { Queries } from '../read-models';
import { ExternalQueries } from '../third-parties';

export type DependenciesForViews = Queries & ExternalQueries & { logger: Logger };
