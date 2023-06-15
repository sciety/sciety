import { handleEvent, initialState } from './handle-event';
import { getCurationStatements } from './get-curation-statements';

export const curationStatements = {
  queries: {
    getCurationStatements,
  },
  initialState,
  handleEvent,
};
