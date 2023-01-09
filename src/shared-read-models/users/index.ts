import { handleEvent, initialState } from './handle-event';
import { queries } from './queries';

export { initialState, handleEvent } from './handle-event';
export { queries, Queries } from './queries';

export const readmodel = {
  initialState,
  handleEvent,
  queries,
};
