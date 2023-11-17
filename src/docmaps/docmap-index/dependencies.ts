import { Ports as DocmapDependencies } from '../docmap/construct-docmap-view-model.js';
import { Logger } from '../../shared-ports/index.js';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
