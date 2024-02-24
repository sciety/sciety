import { Ports as DocmapDependencies } from '../docmap/construct-docmap-view-model.js';
import { Logger } from '../../infrastructure/index.js';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
