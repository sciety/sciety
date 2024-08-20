import { DependenciesForViews } from '../read-side/dependencies-for-views';
import { DependenciesForCommands } from '../write-side';

export type DependenciesForSagas = DependenciesForViews & DependenciesForCommands;
