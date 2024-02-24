import { annotationsStatus } from './annotations-status.js';
import { getAnnotationContent } from './get-annotation-content.js';
import { handleEvent, initialState } from './handle-event.js';

export const annotations = {
  queries: {
    annotationsStatus,
    getAnnotationContent,
  },
  initialState,
  handleEvent,
};
