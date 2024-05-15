import { Ports as DocmapDependencies } from '../../read-side/non-html-views/docmaps/docmap/construct-docmap-view-model';
import { Logger } from '../../shared-ports';

export type Dependencies = DocmapDependencies & {
  logger: Logger,
};
