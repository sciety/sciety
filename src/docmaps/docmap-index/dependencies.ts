import { Logger } from '../../shared-ports';
import { Ports as DocmapDependencies } from '../docmap/construct-docmap-view-model';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
