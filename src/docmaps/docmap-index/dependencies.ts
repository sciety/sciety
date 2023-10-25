import { Ports as DocmapDependencies } from '../docmap/construct-docmap-view-model';
import { Logger } from '../../shared-ports';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
