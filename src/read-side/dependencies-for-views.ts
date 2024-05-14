import { Queries } from '../read-models';
import { Logger } from '../shared-ports';
import { ExternalQueries } from '../third-parties';

export type DependenciesForViews = Queries & ExternalQueries & { logger: Logger };
