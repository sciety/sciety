import { Ports as DocmapDependencies } from '../docmap/construct-docmap-view-model';
import { Logger } from '../../infrastructure-contract';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
