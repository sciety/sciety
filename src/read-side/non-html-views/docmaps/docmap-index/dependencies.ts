import { Logger } from '../../../../logger';
import { Dependencies as DocmapDependencies } from '../docmap/construct-docmap-view-model';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
