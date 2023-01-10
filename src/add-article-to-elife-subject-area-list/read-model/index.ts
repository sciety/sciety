import { handleEvent, initialState } from './handle-event';
import { queries } from './queries';

// ts-unused-exports:disable-next-line
export { elifeGroupId } from './data';

export const readmodel = {
  initialState,
  handleEvent,
  queries,
};
