import * as TE from 'fp-ts/TaskEither';
import * as DE from '../../types/data-error';
import { DependenciesForViews } from '../dependencies-for-views';

export type ConstructViewModel<P, VM> = (dependencies: DependenciesForViews)
=> (params: P)
=> TE.TaskEither<DE.DataError, VM>;
