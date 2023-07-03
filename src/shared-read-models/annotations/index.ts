import { annotationsStatus } from './annotations-status';
import { getAnnotationContent } from './get-annotation-content';
import { handleEvent, initialState } from './handle-event';

export const annotations = {
  queries: {
    annotationsStatus,
    getAnnotationContent,
  },
  initialState,
  handleEvent,
};
