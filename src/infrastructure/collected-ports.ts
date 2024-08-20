import { DependenciesForViews } from '../read-side/dependencies-for-views';
import { DependenciesForSagas } from '../sagas/dependencies-for-sagas';
import { DependenciesForCommands } from '../write-side';

export type CollectedPorts = DependenciesForViews & DependenciesForCommands & DependenciesForSagas;
