import { getCurationStatements } from './get-curation-statements';
import { ReadModel } from './handle-event';

export type Queries = {
  getCurationStatements: ReturnType<typeof getCurationStatements>,
};

export const queries = (instance: ReadModel): Queries => ({
  getCurationStatements: getCurationStatements(instance),
});
