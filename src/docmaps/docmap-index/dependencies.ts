import { Ports as IdentifyAllPossibleIndexEntriesDependencies } from './identify-all-possible-index-entries';
import { Ports as DocmapDependencies } from '../docmap/construct-docmap-view-model';

export type Dependencies = DocmapDependencies & IdentifyAllPossibleIndexEntriesDependencies;
