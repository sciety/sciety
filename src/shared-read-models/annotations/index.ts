import { getAnnotationContent } from './get-annotation-content';
import { handleEvent, initialState } from './handle-event';

export const annotations = {
  queries: {
    getAnnotationContent,
  },
  initialState,
  handleEvent,
};
