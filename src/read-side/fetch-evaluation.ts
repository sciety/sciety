import { Queries } from '../read-models';
import { ExternalQueries } from '../third-parties';

type Dependencies = Queries & ExternalQueries;

// ts-unused-exports:disable-next-line
export const fetchEvaluation = (dependencies: Dependencies): ExternalQueries['fetchEvaluation'] => dependencies.fetchEvaluation;
