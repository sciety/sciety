import { Ports as DocmapDependencies } from '../docmap/construct-docmap-view-model';
import { Logger } from '../../infrastructure';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
