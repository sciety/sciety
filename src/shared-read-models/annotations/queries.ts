import { ReadModel } from './handle-event';
import { getAnnotationContent, GetAnnotationContent } from './get-annotation-content';

export type Queries = {
  getAnnotationContent: GetAnnotationContent,
};

export const queries = (instance: ReadModel): Queries => ({
  getAnnotationContent: getAnnotationContent(instance),
});
